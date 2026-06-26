"from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title=\"haart Cambridge API\")
api_router = APIRouter(prefix=\"/api\")


# ---------- Models ----------
class Property(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    address: str
    area: str  # e.g. \"Cherry Hinton\", \"Trumpington\"
    postcode: str
    price: int  # in GBP. If rent, monthly rent.
    listing_type: str  # \"sale\" | \"rent\"
    status: str = \"available\"  # available | under_offer | let_agreed | sold
    bedrooms: int
    bathrooms: int
    receptions: int = 1
    property_type: str  # detached, semi, terrace, apartment, cottage, bungalow
    tenure: Optional[str] = None  # freehold | leasehold (sale only)
    epc: str = \"C\"
    description: str
    features: List[str] = []
    images: List[str] = []
    latitude: float = 52.2053
    longitude: float = 0.1218
    featured: bool = False
    agent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Agent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    bio: str
    email: str
    phone: str
    image: str
    years_experience: int


class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    rating: int
    text: str
    service: str  # \"Sales\", \"Lettings\", \"Mortgage\"
    date: str  # ISO


class ValuationRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    address: str
    postcode: str
    property_type: str
    bedrooms: int
    purpose: str  # \"selling\" | \"letting\" | \"both\"
    notes: Optional[str] = \"\"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ValuationRequestCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    address: str
    postcode: str
    property_type: str
    bedrooms: int
    purpose: str
    notes: Optional[str] = \"\"


class Enquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: Optional[str] = \"\"
    subject: str
    message: str
    property_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EnquiryCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = \"\"
    subject: str
    message: str
    property_id: Optional[str] = None


# ---------- Seed data ----------
PROPERTY_IMAGES = [
    \"https://images.unsplash.com/photo-1775974861298-8fe164a40024?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1696091197440-e31bd79988f6?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1598307754921-da47ead0ad5f?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80\",
]

INTERIOR_IMAGES = [
    \"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80\",
    \"https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80\",
]

SEED_AGENTS = [
    {
        \"name\": \"Imran Akhtar\",
        \"role\": \"Area Partner\",
        \"bio\": \"With over 18 years guiding Cambridge sellers and investors, Imran is known for going above and beyond on every transaction.\",
        \"email\": \"imran.akhtar@haart.co.uk\",
        \"phone\": \"+44 1223 785791\",
        \"image\": \"https://images.unsplash.com/photo-1647580427155-0483906cb9de?w=600&q=80\",
        \"years_experience\": 18,
    },
    {
        \"name\": \"Holly Whitmore\",
        \"role\": \"Senior Lettings Manager\",
        \"bio\": \"Holly takes a personal approach to every let, supporting landlords and tenants alike through the full lettings journey.\",
        \"email\": \"holly.whitmore@haart.co.uk\",
        \"phone\": \"+44 1223 785792\",
        \"image\": \"https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=600&q=80\",
        \"years_experience\": 9,
    },
    {
        \"name\": \"Patryk Nowak\",
        \"role\": \"Sales Negotiator\",
        \"bio\": \"Helpful, responsive and meticulous — Patryk consistently earns five-star reviews from Cambridge buyers and sellers.\",
        \"email\": \"patryk.nowak@haart.co.uk\",
        \"phone\": \"+44 1223 785793\",
        \"image\": \"https://images.unsplash.com/photo-1770199105692-9e52ff137cad?w=600&q=80\",
        \"years_experience\": 6,
    },
]

CAMBRIDGE_AREAS = [
    (\"Trumpington\", \"CB2\", 52.1768, 0.1099),
    (\"Cherry Hinton\", \"CB1\", 52.1875, 0.1605),
    (\"Newnham\", \"CB3\", 52.2003, 0.1014),
    (\"Chesterton\", \"CB4\", 52.2218, 0.1395),
    (\"Romsey\", \"CB1\", 52.1969, 0.1437),
    (\"Mill Road\", \"CB1\", 52.2026, 0.1382),
    (\"Arbury\", \"CB4\", 52.2287, 0.1235),
    (\"Histon\", \"CB24\", 52.2510, 0.0998),
]

SEED_REVIEWS = [
    {\"author\": \"James W.\", \"rating\": 5, \"text\": \"The area partner, Mr Akhtar went above and beyond to assist in facilitating the transaction. An excellent chap and an excellent business which I can highly recommend.\", \"service\": \"Sales\", \"date\": \"2025-11-12\"},
    {\"author\": \"Sarah P.\", \"rating\": 5, \"text\": \"I have been very pleased by the service Holly and colleagues have given. They take a personal approach, highly supportive of the whole process.\", \"service\": \"Lettings\", \"date\": \"2025-10-28\"},
    {\"author\": \"Daniel R.\", \"rating\": 5, \"text\": \"I had a great experience working with Patryk from haart estate and letting agents in Cambridge. He was very helpful and responsive, and I highly recommend their services.\", \"service\": \"Sales\", \"date\": \"2025-10-04\"},
    {\"author\": \"Emma L.\", \"rating\": 5, \"text\": \"Sold our family home in Trumpington in under three weeks. Honest valuation, polished marketing, and a calm pair of hands during negotiations.\", \"service\": \"Sales\", \"date\": \"2025-09-20\"},
    {\"author\": \"Michael T.\", \"rating\": 4, \"text\": \"Professional throughout. The team kept us informed at every stage and the conveyancing handover was seamless.\", \"service\": \"Sales\", \"date\": \"2025-09-08\"},
    {\"author\": \"Priya S.\", \"rating\": 5, \"text\": \"First-time landlord and they made it effortless. Tenant found within 10 days and full property management has been a dream.\", \"service\": \"Lettings\", \"date\": \"2025-08-15\"},
]


def _seed_properties():
    titles_sale = [
        \"Elegant Victorian Townhouse\",
        \"Refurbished Edwardian Semi\",
        \"Three-Bed Family Home\",
        \"Period Cottage with Garden\",
        \"Modern Detached Residence\",
        \"Riverside Apartment\",
        \"Mews House with Courtyard\",
        \"Georgian End-of-Terrace\",
        \"Contemporary Architect-Designed Home\",
    ]
    titles_rent = [
        \"Bright Two-Bed Apartment\",
        \"Furnished Student House\",
        \"City Centre Studio\",
        \"Family House with Gardens\",
        \"Modern One-Bed Flat\",
        \"Spacious Three-Bed Semi\",
        \"Stylish Loft Conversion\",
    ]

    properties = []
    # Sale properties
    for i, title in enumerate(titles_sale):
        area, postcode_prefix, lat, lng = CAMBRIDGE_AREAS[i % len(CAMBRIDGE_AREAS)]
        beds = 2 + (i % 4)
        price = 425000 + (i * 95000) + (beds * 35000)
        ptype = [\"semi-detached\", \"detached\", \"terraced\", \"apartment\", \"cottage\"][i % 5]
        imgs = [PROPERTY_IMAGES[i % len(PROPERTY_IMAGES)],
                INTERIOR_IMAGES[i % len(INTERIOR_IMAGES)],
                INTERIOR_IMAGES[(i + 2) % len(INTERIOR_IMAGES)],
                PROPERTY_IMAGES[(i + 3) % len(PROPERTY_IMAGES)]]
        properties.append({
            \"title\": title,
            \"address\": f\"{12 + i*4} {area} Road\",
            \"area\": area,
            \"postcode\": f\"{postcode_prefix} {1 + i}AB\",
            \"price\": price,
            \"listing_type\": \"sale\",
            \"status\": \"available\" if i % 5 != 0 else \"under_offer\",
            \"bedrooms\": beds,
            \"bathrooms\": max(1, beds - 1),
            \"receptions\": 1 + (i % 2),
            \"property_type\": ptype,
            \"tenure\": \"Freehold\" if ptype != \"apartment\" else \"Leasehold\",
            \"epc\": [\"B\", \"C\", \"D\"][i % 3],
            \"description\": (
                f\"A beautifully presented {beds}-bedroom {ptype} located in the highly sought-after \"
                f\"area of {area}, Cambridge. Featuring elegant proportions, period charm and \"
                f\"contemporary upgrades, this home offers easy access to the city centre, mainline \"
                f\"station and renowned local schools.\"
            ),
            \"features\": [
                \"Off-street parking\", \"Private rear garden\", \"South-facing aspect\",
                \"Walking distance to station\", \"Catchment for outstanding schools\",
                \"Recently refurbished\", \"Open-plan kitchen-diner\",
            ][: 4 + (i % 3)],
            \"images\": imgs,
            \"latitude\": lat,
            \"longitude\": lng,
            \"featured\": i < 4,
        })

    # Rental properties
    for i, title in enumerate(titles_rent):
        area, postcode_prefix, lat, lng = CAMBRIDGE_AREAS[(i + 3) % len(CAMBRIDGE_AREAS)]
        beds = 1 + (i % 4)
        rent = 1150 + (i * 175) + (beds * 250)
        ptype = [\"apartment\", \"terraced\", \"studio\", \"semi-detached\"][i % 4]
        imgs = [PROPERTY_IMAGES[(i + 5) % len(PROPERTY_IMAGES)],
                INTERIOR_IMAGES[(i + 1) % len(INTERIOR_IMAGES)],
                PROPERTY_IMAGES[(i + 7) % len(PROPERTY_IMAGES)],
                INTERIOR_IMAGES[(i + 4) % len(INTERIOR_IMAGES)]]
        properties.append({
            \"title\": title,
            \"address\": f\"{7 + i*3} {area} Street\",
            \"area\": area,
            \"postcode\": f\"{postcode_prefix} {2 + i}CD\",
            \"price\": rent,
            \"listing_type\": \"rent\",
            \"status\": \"available\" if i % 6 != 0 else \"let_agreed\",
            \"bedrooms\": beds,
            \"bathrooms\": max(1, beds // 2),
            \"receptions\": 1,
            \"property_type\": ptype,
            \"tenure\": None,
            \"epc\": [\"B\", \"C\", \"D\"][i % 3],
            \"description\": (
                f\"A well-presented {beds}-bedroom {ptype} available to rent in {area}. \"
                f\"Offered on an unfurnished basis with excellent transport links and modern fittings throughout.\"
            ),
            \"features\": [
                \"Unfurnished\", \"Available immediately\", \"Double glazing\",
                \"Gas central heating\", \"Allocated parking\", \"Communal gardens\",
            ][: 3 + (i % 3)],
            \"images\": imgs,
            \"latitude\": lat,
            \"longitude\": lng,
            \"featured\": i < 2,
        })

    return properties


async def seed_db():
    if await db.properties.count_documents({}) == 0:
        # Seed agents first to get IDs
        agent_docs = []
        for a in SEED_AGENTS:
            agent_docs.append(Agent(**a).model_dump())
        await db.agents.insert_many(agent_docs)

        agent_ids = [a[\"id\"] for a in agent_docs]
        prop_docs = []
        for i, p in enumerate(_seed_properties()):
            p[\"agent_id\"] = agent_ids[i % len(agent_ids)]
            doc = Property(**p).model_dump()
            doc[\"created_at\"] = doc[\"created_at\"].isoformat()
            prop_docs.append(doc)
        await db.properties.insert_many(prop_docs)

    if await db.reviews.count_documents({}) == 0:
        review_docs = [Review(**r).model_dump() for r in SEED_REVIEWS]
        await db.reviews.insert_many(review_docs)


@app.on_event(\"startup\")
async def on_startup():
    await seed_db()


# ---------- Routes ----------
@api_router.get(\"/\")
async def root():
    return {\"service\": \"haart Cambridge\", \"status\": \"ok\"}


@api_router.get(\"/branch\")
async def branch_info():
    return {
        \"name\": \"haart Estate and Lettings Agents Cambridge\",
        \"rating\": 4.8,
        \"reviews_count\": 1984,
        \"address\": \"64 Regent St, Cambridge CB2 1DP, United Kingdom\",
        \"phone\": \"+44 1223 785791\",
        \"email\": \"cambridge@haart.co.uk\",
        \"hours\": [
            {\"day\": \"Mon-Fri\", \"open\": \"08:30\", \"close\": \"18:30\"},
            {\"day\": \"Saturday\", \"open\": \"09:00\", \"close\": \"17:00\"},
            {\"day\": \"Sunday\", \"open\": \"Closed\", \"close\": \"\"},
        ],
        \"latitude\": 52.2026,
        \"longitude\": 0.1218,
        \"services\": [
            \"Property Sales\", \"Residential Lettings\", \"Free Property Valuation\",
            \"Mortgage Advice\", \"Conveyancing Advice\", \"Property Management\",
            \"Property Auctions\", \"Investor Services\", \"Luxury Property\",
            \"Land Sales\", \"Legal Services\", \"Tenant Advice\",
        ],
    }


@api_router.get(\"/properties\")
async def list_properties(
    listing_type: Optional[str] = Query(None),
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bedrooms: Optional[int] = None,
    area: Optional[str] = None,
    property_type: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = 60,
):
    q: dict = {}
    if listing_type:
        q[\"listing_type\"] = listing_type
    if min_price is not None:
        q.setdefault(\"price\", {})[\"$gte\"] = min_price
    if max_price is not None:
        q.setdefault(\"price\", {})[\"$lte\"] = max_price
    if bedrooms is not None:
        q[\"bedrooms\"] = {\"$gte\": bedrooms}
    if area:
        q[\"area\"] = {\"$regex\": f\"^{area}$\", \"$options\": \"i\"}
    if property_type:
        q[\"property_type\"] = property_type
    if featured is not None:
        q[\"featured\"] = featured

    docs = await db.properties.find(q, {\"_id\": 0}).limit(limit).to_list(limit)
    return docs


@api_router.get(\"/properties/areas\")
async def list_areas():
    areas = await db.properties.distinct(\"area\")
    return sorted(areas)


@api_router.get(\"/properties/{property_id}\")
async def get_property(property_id: str):
    doc = await db.properties.find_one({\"id\": property_id}, {\"_id\": 0})
    if not doc:
        raise HTTPException(status_code=404, detail=\"Property not found\")
    agent = None
    if doc.get(\"agent_id\"):
        agent = await db.agents.find_one({\"id\": doc[\"agent_id\"]}, {\"_id\": 0})
    return {\"property\": doc, \"agent\": agent}


@api_router.get(\"/agents\")
async def list_agents():
    docs = await db.agents.find({}, {\"_id\": 0}).to_list(50)
    return docs


@api_router.get(\"/reviews\")
async def list_reviews():
    docs = await db.reviews.find({}, {\"_id\": 0}).to_list(100)
    return docs


@api_router.post(\"/valuations\", response_model=ValuationRequest)
async def create_valuation(payload: ValuationRequestCreate):
    obj = ValuationRequest(**payload.model_dump())
    doc = obj.model_dump()
    doc[\"created_at\"] = doc[\"created_at\"].isoformat()
    await db.valuations.insert_one(doc)
    return obj


@api_router.post(\"/enquiries\", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate):
    obj = Enquiry(**payload.model_dump())
    doc = obj.model_dump()
    doc[\"created_at\"] = doc[\"created_at\"].isoformat()
    await db.enquiries.insert_one(doc)
    return obj


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event(\"shutdown\")
async def shutdown_db_client():
    client.close()
"

