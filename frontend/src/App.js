import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Companies from "./Pages/Companies";
import DashboardLayout from "./Components/Dashboard";
import Calculations from "./Pages/calculations";
import Weightage from "./Pages/Weightage";
import PortfolioSD from "./Pages/PortfolioSD";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/companies" element={<Companies />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/weightage" element={<Weightage />} />
          <Route path="/portfolio-sd" element={<PortfolioSD />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
