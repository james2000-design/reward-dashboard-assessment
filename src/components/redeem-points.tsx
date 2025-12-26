import { useState } from "react";
import { Gift, Layers } from "lucide-react";
import RewardCard from "./shared/reward-card";
import { GiMoneyStack } from "react-icons/gi";

const RedeemRewards = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const rewards = [
    {
      title: "$5 Bank Transfer",
      description:
        "The $5 equivalent will be transferred to your bank account.",
      points: 5000,
      icon: <GiMoneyStack className="w-8 h-8 text-gray-600" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$5 PayPal International",
      description:
        "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
      points: 5000,
      icon: <GiMoneyStack className="w-8 h-8 text-gray-600" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$5 Virtual Visa Card",
      description:
        "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$5 Apple Gift Card",
      description:
        "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$5 Google Play Card",
      description:
        "Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$5 Amazon Gift Card",
      description:
        "Get a $5 digital gift card to spend on your favorite tools or platforms.",
      points: 5000,
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      locked: true,
      category: "locked",
    },
    {
      title: "$10 Amazon Gift Card",
      description:
        "Get a $10 digital gift card to spend on your favorite tools or platforms.",
      points: 10000,
      icon: <Gift className="w-8 h-8 text-orange-500" />,
      locked: true,
      category: "locked",
    },
    {
      title: "Free Udemy Course",
      description: "Coming Soon!",
      points: 0,
      icon: <Layers className="w-8 h-8 text-purple-600" />,
      comingSoon: true,
      category: "coming",
    },
  ];

  const filterCounts = {
    all: rewards.length,
    unlocked: rewards.filter((r) => !r.locked && !r.comingSoon).length,
    locked: rewards.filter((r) => r.locked).length,
    coming: rewards.filter((r) => r.comingSoon).length,
  };

  const filteredRewards = rewards.filter((reward) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unlocked")
      return !reward.locked && !reward.comingSoon;
    if (activeFilter === "locked") return reward.locked;
    if (activeFilter === "coming") return reward.comingSoon;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
            Redeem Your Points
          </h1>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-lg text-sm   transition ${
                activeFilter === "all"
                  ? "bg-purple-100 text-purple-600 border-b-2 rounded-b-none border-b-purple-600"
                  : "bg-white text-gray-400 hover:bg-purple-100"
              }`}
            >
              All Rewards{" "}
              <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                {filterCounts.all}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("unlocked")}
              className={`px-6 py-2 rounded-lg text-sm  transition ${
                activeFilter === "unlocked"
                  ? "bg-purple-100 text-purple-600 border-b-2 rounded-b-none border-b-purple-600"
                  : "bg-white text-gray-400 hover:bg-purple-100"
              }`}
            >
              Unlocked{" "}
              <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                {filterCounts.unlocked}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("locked")}
              className={`px-6 py-2 rounded-lg text-sm  transition ${
                activeFilter === "locked"
                  ? "bg-purple-100 text-purple-600 border-b-2 rounded-b-none border-b-purple-600"
                  : "bg-white text-gray-400 hover:bg-purple-100"
              }`}
            >
              Locked{" "}
              <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                {filterCounts.locked}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("coming")}
              className={`px-6 py-2 rounded-lg text-sm transition ${
                activeFilter === "coming"
                  ? "bg-purple-100 text-purple-600 border-b-2 rounded-b-none border-b-purple-600"
                  : "bg-white text-gray-400 hover:bg-gray-100"
              }`}
            >
              Coming Soon{" "}
              <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                {filterCounts.coming}
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward, idx) => (
            <RewardCard key={reward.title + idx} reward={reward} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedeemRewards;
