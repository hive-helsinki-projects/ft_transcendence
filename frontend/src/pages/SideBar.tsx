import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, Gamepad2, Trophy, Settings, HelpCircle } from "lucide-react";

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
    <div>
      {menuItems.map(({ id, icon: Icon, path }) => (
        <Link to={path} key={id} onClick={() => setSelected(id)}>
          <button
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition ${
              selected === id ? "bg-gray-700" : "bg-transparent"
            }`}
          >
            <Icon size={24} />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;