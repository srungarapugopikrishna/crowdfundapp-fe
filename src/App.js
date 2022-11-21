import "./App.css";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Categories from "./components/Categories";
import MyFunds from "./components/MyFunds";
import Home from "./components/Home";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myfunds" element={<MyFunds />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
