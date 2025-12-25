import { Star } from "lucide-react";

export default function RewardCard({ reward }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
        {reward.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
        {reward.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {reward.description}
      </p>
      <div className="flex items-center justify-center gap-1 mb-4 text-purple-600">
        <Star className="w-4 h-4 fill-purple-600" />
        <span className="font-semibold">{reward.points} pts</span>
      </div>
      <button className="w-full bg-gray-200 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed">
        Locked
      </button>
    </div>
  );
}
