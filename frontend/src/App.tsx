import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./pages/SideBar";
import Pong from "./game/Pong";

const App = () => {
  return (
    <Router>
      <div>
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Frame */}
        <div>
          <Routes>
            {/* Route for the Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Route for the Game */}
            <Route path="/game" element={<Pong />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
