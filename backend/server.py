from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
  client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
      return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
  client.close()

===END

===FILE: /app/frontend/tailwind.config.js
/app/frontend/tailwind.config.js:
1|/** @type {import('tailwindcss').Config} */
2|module.exports = {
3|    darkMode: ["class"],
4|    content: [
5|    "./src/**/*.{js,jsx,ts,tsx}",
6|    "./public/index.html"
7|  ],
8|  theme: {
9|    extend: {
10|      borderRadius: {
11|        lg: 'var(--radius)',
12|        md: 'calc(var(--radius) - 2px)',
13|        sm: 'calc(var(--radius) - 4px)'
14|      },
15|      colors: {
16|        background: 'hsl(var(--background))',
17|        foreground: 'hsl(var(--foreground))',
18|        card: {
19|          DEFAULT: 'hsl(var(--card))',
20|          foreground: 'hsl(var(--card-foreground))'
21|        },
22|        popover: {
23|          DEFAULT: 'hsl(var(--popover))',
24|          foreground: 'hsl(var(--popover-foreground))'
25|        },
26|        primary: {
27|          DEFAULT: 'hsl(var(--primary))',
28|          foreground: 'hsl(var(--primary-foreground))'
29|        },
30|        secondary: {
31|          DEFAULT: 'hsl(var(--secondary))',
32|          foreground: 'hsl(var(--secondary-foreground))'
33|        },
34|        muted: {
35|          DEFAULT: 'hsl(var(--muted))',
36|          foreground: 'hsl(var(--muted-foreground))'
37|        },
38|        accent: {
39|          DEFAULT: 'hsl(var(--accent))',
40|          foreground: 'hsl(var(--accent-foreground))'
41|        },
42|        destructive: {
43|          DEFAULT: 'hsl(var(--destructive))',
44|          foreground: 'hsl(var(--destructive-foreground))'
45|        },
46|        border: 'hsl(var(--border))',
47|        input: 'hsl(var(--input))',
48|        ring: 'hsl(var(--ring))',
49|        chart: {
50|          '1': 'hsl(var(--chart-1))',
51|          '2': 'hsl(var(--chart-2))',
52|          '3': 'hsl(var(--chart-3))',
53|          '4': 'hsl(var(--chart-4))',
54|          '5': 'hsl(var(--chart-5))'
55|        }
56|      },
57|      keyframes: {
58|        'accordion-down': {
59|          from: {
60|            height: '0'
61|          },
62|          to: {
63|            height: 'var(--radix-accordion-content-height)'
64|          }
65|        },
66|        'accordion-up': {
67|          from: {
68|            height: 'var(--radix-accordion-content-height)'
69|          },
70|          to: {
71|            height: '0'
72|          }
73|        }
74|      },
75|      animation: {
76|        'accordion-down': 'accordion-down 0.2s ease-out',
77|        'accordion-up': 'accordion-up 0.2s ease-out'
78|      }
79|    }
80|  },
81|  plugins: [require("tailwindcss-animate")],
82|};

===END
