export default function Tabs({ activeTab, setActiveTab }: any) {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-8">
      <button
        onClick={() => setActiveTab("earn")}
        className={`pb-3 px-1 font-medium transition-colors relative ${
          activeTab === "earn"
            ? "text-purple-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Earn Points
        {activeTab === "earn" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
        )}
      </button>
      <button
        onClick={() => setActiveTab("redeem")}
        className={`pb-3 px-1 font-medium transition-colors relative ${
          activeTab === "redeem"
            ? "text-purple-600"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Redeem Rewards
        {activeTab === "redeem" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
        )}
      </button>
    </div>
  );
}
