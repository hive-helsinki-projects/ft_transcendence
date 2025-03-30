import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Gamepad2, Trophy, Globe, Settings, HelpCircle } from "lucide-react";

const Sidebar = () => {
  const [selected, setSelected] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "game", icon: Gamepad2, path: "/game"},
    { id: "trophy", icon: Trophy, path: "/trophy" },
    { id: "globe", icon: Globe, path: "/globe" },
    { id: "settings", icon: Settings, path: "/settings" },
    { id: "help", icon: HelpCircle, path: "/help" },
  ];

  return (
    <div className="w-16 bg-gray-900 h-full flex flex-col items-center py-6 space-y-6">
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