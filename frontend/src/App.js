import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Companies from "./Pages/Companies";

function App() {
  return (
    <div className="App">
      <h1>Stock Project</h1>
      <Routes>
        <Route path="/Companies" element={<Companies />} />
      </Routes>
    </div>
  );
}

export default App;
