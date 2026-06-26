import \"@/App.css\";
import { BrowserRouter, Routes, Route } from \"react-router-dom\";
import Header from \"@/components/Header\";
import Footer from \"@/components/Footer\";
import Home from \"@/pages/Home\";
import Properties from \"@/pages/Properties\";
import PropertyDetail from \"@/pages/PropertyDetail\";
import Valuation from \"@/pages/Valuation\";
import About from \"@/pages/About\";
import Contact from \"@/pages/Contact\";

function ScrollToTop() {
  // Handled by react-router scroll restoration default; minimal stub
  return null;
}

function App() {
  return (
    <div className=\"App\">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path=\"/\" element={<Home />} />
          <Route path=\"/properties\" element={<Properties />} />
          <Route path=\"/property/:id\" element={<PropertyDetail />} />
          <Route path=\"/valuation\" element={<Valuation />} />
          <Route path=\"/about\" element={<About />} />
          <Route path=\"/contact\" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
