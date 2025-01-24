import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlaySquare, Image, Monitor, Settings, Palette } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/playlists", icon: PlaySquare, label: "Listes de diffusion" },
    { to: "/media", icon: Image, label: "Médiathèque" },
    { to: "/templates", icon: Palette, label: "Modèles" },
    { to: "/screens", icon: Monitor, label: "Écrans" },
    { to: "/settings", icon: Settings, label: "Paramètres" }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Affichage Dynamique</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;