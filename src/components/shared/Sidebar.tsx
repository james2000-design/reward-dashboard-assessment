import { useState } from "react";
import {
  Home,
  Compass,
  BookOpen,
  Layers,
  CreditCard,
  Gift,
  Settings,
} from "lucide-react";
import logo from "../../assets/flowva_logo.png";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const email = user?.email ?? "";
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (email ? email.split("@")[0] : "User");
  const letter =
    name?.charAt(0).toUpperCase() ?? email?.charAt(0).toUpperCase() ?? "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
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

          <div className="p-4 border-t border-gray-200 relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-semibold">{letter}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-gray-900 truncate">{name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {email
                    ? `${email.slice(0, 20)}${email.length > 20 ? "..." : ""}`
                    : ""}
                </p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`fixed left-4 bottom-24 z-[70] w-60 bg-white rounded-2xl shadow-2xl border-2 border-purple-500 overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-6  flex flex-col">
          <button className=" text-left px-4 py-2 text-md  text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Feedback
          </button>
          <button className=" text-left px-4 py-2 text-md  text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Support
          </button>
          <button
            onClick={handleLogout}
            className=" text-left px-4 py-2 text-md  text-gray-900 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
