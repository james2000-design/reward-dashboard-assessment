import EarnPoints from "../components/earnpoints";
import RewardCard from "../components/reward-card";
import Tabs from "../components/tabs";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import { CreditCard, Gift } from "lucide-react";

export default function RewardsHub() {
  const [activeTab, setActiveTab] = useState("earn");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rewards = [
    {
      title: "$5 Bank Transfer",
      description:
        "The $5 equivalent will be transferred to your bank account.",
      points: 5000,
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
    {
      title: "$5 PayPal International",
      description:
        "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
      points: 5000,
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
    {
      title: "$5 Virtual Visa Card",
      description:
        "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
      points: 5000,
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
    {
      title: "$5 Apple Gift Card",
      description: "Redeem for apps, games, music, and more on the App Store.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
    {
      title: "$5 Google Play Card",
      description: "Use for apps, games, and content on Google Play.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
    {
      title: "$5 Amazon Gift Card",
      description: "Shop millions of products on Amazon with your gift card.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-purple-600" />,
      locked: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
          {activeTab === "redeem" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward, idx) => (
                <RewardCard key={idx} reward={reward} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
