import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, Gamepad2, Trophy, Settings, HelpCircle } from "lucide-react";
import "../css/Sidebar.css";

const Sidebar = () => {
  const [selected, setSelected] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "user", icon: User, path: "/dashboard" },
    { id: "game", icon: Gamepad2, path: "/game" },
    { id: "trophy", icon: Trophy, path: "/tournament" },
    { id: "settings", icon: Settings, path: "/settings" },
    { id: "help", icon: HelpCircle, path: "/help" },
  ];

  return (
    <div className="sidebar">
      {menuItems.map(({ id, icon: Icon, path }) => (
        <Link to={path} key={id} onClick={() => setSelected(id)}>
          <button
            type="button"
            aria-label={id}
            className={`sidebar-button ${selected === id ? "selected" : ""}`}
          >
            <Icon size={24} />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;