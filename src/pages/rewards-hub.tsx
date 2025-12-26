import EarnPoints from "../components/earnpoints";
import Tabs from "../components/tabs";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import { useState } from "react";
import RedeemRewards from "../components/redeem-points";

export default function RewardsHub() {
  const [activeTab, setActiveTab] = useState("earn");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="p-6 max-w-7xl mx-auto">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "earn" && <EarnPoints />}
          {activeTab === "redeem" && <RedeemRewards />}
        </div>
      </main>
    </div>
  );
}
