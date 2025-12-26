import React from "react";
import { FaStar } from "react-icons/fa6";

interface Reward {
  comingSoon?: boolean;
  locked?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  points: number;
}

interface RewardCardProps {
  reward: Reward;
}

const RewardCard = ({ reward }: RewardCardProps) => {
  const getStatusButton = () => {
    if (reward.comingSoon) {
      return (
        <button className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed">
          Coming Soon
        </button>
      );
    }
    if (reward.locked) {
      return (
        <button className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed">
          Locked
        </button>
      );
    }
    return (
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition">
        Redeem Now
      </button>
    );
  };

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          {reward.icon}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
        {reward.title}
      </h3>

      <p className="text-gray-600 text-center text-sm mb-6 flex-grow">
        {reward.description}
      </p>

      <div className="flex items-center justify-center gap-1 mb-4">
        <FaStar className="text-yellow-200" size={24} />
        <span className="text-purple-600 font-semibold">
          {reward.points.toLocaleString()} pts
        </span>
      </div>

      {getStatusButton()}
    </div>
  );
};

export default RewardCard;
