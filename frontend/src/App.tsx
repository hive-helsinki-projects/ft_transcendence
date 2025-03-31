import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./pages/SideBar";
import Pong from "./game/pong";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Tournament from "./pages/Tournament";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

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

            {/* Route for the Dashboard Page*/}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Route for the Register Page */}
            <Route path="/register" element={<Register />} />

            {/* Route for the Game Page*/}
            <Route path="/game" element={<Pong />} />

            {/* Route for the Tournament Page */}
            <Route path="/tournament" element={<Tournament />} />

            {/* Route for the Help Page */}
            <Route path="/help" element={<Help />} />

            {/* Route for the Settings Page */}
            <Route path="/settings" element={<Settings />} />

            {/* Fallback Route */}
            <Route path="*" element={<div>404 Not Found</div>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
