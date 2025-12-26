import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white  sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-start gap-4">
          <button
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={32} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Rewards Hub
            </h1>
            <p className="text-gray-600 ">
              Earn points, unlock rewards, and celebrate your progress!
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
