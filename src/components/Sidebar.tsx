import {
  Home,
  Compass,
  BookOpen,
  Layers,
  CreditCard,
  Gift,
  Settings,
} from "lucide-react";
import logo from "../assets/flowva_logo.png";
const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Discover", path: "/discover" },
  { icon: BookOpen, label: "Library", path: "/library" },
  { icon: Layers, label: "Tech Stack", path: "/tech-stack" },
  { icon: CreditCard, label: "Subscriptions", path: "/subscriptions" },
  { icon: Gift, label: "Rewards Hub", path: "/rewards", active: true },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar({ sidebarOpen }: any) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-32">
            <img src={logo} alt="Flowwa Logo" />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-semibold">J</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">James</p>
              <p className="text-sm text-gray-500 truncate">
                gbakonjames800@gma...
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
