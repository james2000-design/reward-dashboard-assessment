"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Calendar,
  Star,
  Share2,
  Copy,
  Check,
  GiftIcon,
  Users,
} from "lucide-react";
import { FaBolt, FaStar, FaUserPlus } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import ReclaimIcon from "../assets/reclaim .png";
import ClaimPointsModal from "./shared/claim-points-modal";
import ClaimedInfoModal from "./shared/claimed-info-modal";
import ShareStackModal from "./shared/share-modal";
export default function EarnPoints() {
  const referralLink = "https://app.flowvahub.com/signup/?ref=james9062";
  const [copied, setCopied] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [claimedDates, setClaimedDates] = useState<Record<string, boolean>>({});
  const [openClaimedInfo, setOpenClaimedInfo] = useState(false);
  const [openShareStack, setOpenShareStack] = useState(false);

  const [claiming, setClaiming] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadProfileAndLogs();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent with new points as detail
      // @ts-ignore
      const val = (e as CustomEvent).detail;
      if (typeof val === "number") setPoints(val);
    };

    window.addEventListener("pointsUpdated", handler as EventListener);
    return () =>
      window.removeEventListener("pointsUpdated", handler as EventListener);
  }, []);

  const daysBetween = (a: Date, b: Date) => {
    const _a = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const _b = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((+_a - +_b) / (1000 * 60 * 60 * 24));
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isYesterday = (d: Date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return isSameDay(d, y);
  };

  const getWeekMondayToSunday = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const loadProfileAndLogs = async () => {
    setLoadingPoints(true);
    setLoadError(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setPoints(0);
        setStreak(0);
        setClaimedDates({});
        setLoadError("Not authenticated");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("points, streak, last_claim_date")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setLoadError(profileError.message || "Failed to load profile");
      }

      setPoints(profile?.points ?? 0);
      setStreak(profile?.streak ?? 0);

      const start = new Date();
      start.setDate(start.getDate() - 6);

      const { data: logs, error: logsError } = await supabase
        .from("points_logs")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString());

      if (logsError) {
        setLoadError(logsError.message || "Failed to load logs");
      }

      const map: Record<string, boolean> = {};
      logs?.forEach((l: any) => {
        const d = new Date(l.created_at).toISOString().slice(0, 10);
        map[d] = true;
      });

      setClaimedDates(map);
    } finally {
      setLoadingPoints(false);
    }
  };

  const claimForDate = async (d: Date) => {
    const dateStr = d.toISOString().slice(0, 10);
    if (claimedDates[dateStr]) return;

    setClaiming(true);

    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) throw new Error("Not authenticated");

      // Insert claim log
      await supabase.from("points_logs").insert({
        user_id: user.id,
        action: "daily-claim",
        points: 5,
        created_at: d.toISOString(),
      });

      // Update profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("points, streak, last_claim_date")
        .eq("id", user.id)
        .single();

      const last = profile?.last_claim_date
        ? new Date(profile.last_claim_date)
        : null;

      let newStreak = 1;
      if (last) {
        const diff = daysBetween(d, last);
        if (diff === 1) newStreak = (profile?.streak ?? 0) + 1;
        else if (diff === 0) newStreak = profile?.streak ?? 1;
      }

      const newPoints = (profile?.points ?? 0) + 5;

      await supabase
        .from("profiles")
        .update({
          points: newPoints,
          streak: newStreak,
          last_claim_date: dateStr,
        })
        .eq("id", user.id);

      await loadProfileAndLogs();

      setOpenClaimedInfo(true);
    } finally {
      setClaiming(false);
    }
  };

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const claimedToday = !!claimedDates[todayStr];

  return (
    <>
      <ClaimPointsModal open={open} onClose={() => setOpen(false)} />
      <ClaimedInfoModal
        open={openClaimedInfo}
        onClose={() => setOpenClaimedInfo(false)}
      />
      <ShareStackModal
        open={openShareStack}
        onClose={() => setOpenShareStack(false)}
      />
      {loadError && (
        <div className="mb-4 p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {loadError}
        </div>
      )}
      <div className="space-y-14">
        {/*  Rewards Journey  */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-purple-600 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your Rewards Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Points Balance */}
            <div
              className="bg-whitesmoke rounded-2xl  border gap-4 transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg "
            >
              <div className="flex items-center gap-2 mb-4 bg-blue-50 p-6 ">
                <SlBadge color="purple" size={20} />
                <h3 className="font-semibold">Points Balance</h3>
              </div>

              <div className="flex items-center justify-between mb-4 p-6">
                <span className="text-4xl font-bold text-purple-600">
                  {points}
                </span>

                <div className="relative w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden animate-star">
                  <div className="absolute inset-1 rounded-full bg-yellow-300" />
                  <FaStar size={26} className="relative z-10 text-orange-500" />
                  <div className="wave-overlay absolute inset-0 z-20" />
                </div>
              </div>

              <div className="space-y-2 p-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Progress to $5 Gift Card
                  </span>
                  <span className="font-semibold">
                    {loadingPoints ? "— / 5000" : `${points} / 5000`}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600"
                    style={{
                      width: `${Math.min(100, (points / 5000) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-gray-600">
                  🚀 Just getting started — keep earning points!
                </p>
              </div>
            </div>

            {/* Daily Streak */}
            <div
              className="bg-whitesmoke rounded-2xl  border transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4 bg-blue-50 p-6   ">
                <Calendar className="text-blue-500" size={20} />
                <h3 className="font-semibold">Daily Streak</h3>
              </div>

              <p className="text-3xl font-bold text-purple-600 mb-4 p-6">
                {loadingPoints
                  ? "—"
                  : `${streak} day${streak !== 1 ? "s" : ""}`}
              </p>

              <div className="flex gap-2 mb-4 px-6 ">
                {getWeekMondayToSunday().map((d, i) => {
                  const dateStr = d.toISOString().slice(0, 10);
                  const claimed = !!claimedDates[dateStr];
                  const isToday = isSameDay(d, new Date());
                  const yesterday = isYesterday(d);
                  const claimable = !claimed && (isToday || yesterday);

                  return (
                    <div
                      key={i}
                      onClick={() => claimable && claimForDate(d)}
                      className={` w-9 h-9 rounded-full flex items-center justify-center text-sm  font-medium cursor-pointer bg-gray-200 text-gray-600 ${
                        isToday
                          ? "border-2 border-purple-600"
                          : "border border-transparent"
                      }`}
                    >
                      {d.toLocaleDateString(undefined, { weekday: "short" })[0]}
                    </div>
                  );
                })}
              </div>

              <div className="px-6">
                <p className=" text-sm text-center text-gray-600 p-2 ">
                  Check in daily to to earn +5 points
                </p>
                <button
                  disabled={claimedToday || claiming}
                  onClick={() => {
                    claimForDate(new Date());
                  }}
                  className={`w-full py-3  rounded-3xl flex items-center justify-center gap-2 transition-all
            ${
              claimedToday
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : claiming
                ? "bg-purple-400 text-white"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
                >
                  <FaBolt />
                  {claimedToday
                    ? "Claimed Today"
                    : claiming
                    ? "Claiming..."
                    : "Claim Today's Points"}
                </button>
              </div>
            </div>

            {/* Featured Tool */}
            <div
              className=" text-white transition-all border rounded-2xl duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg  "
            >
              <div className="flex  justify-between items-center bg-gradient-to-r from-purple-500 via-purple-400  to-blue-300 text-white p-4 rounded-t-2xl border ">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3 shrink-0 grow-0">
                    Featured
                  </span>

                  <h3 className="text-xl font-bold mb-1 shrink-0 grow-0">
                    Top Tool Spotlight
                  </h3>

                  <p className="text-lg font-semibold mb-4 shrink-0 grow-0 pt-2">
                    Reclaim
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={ReclaimIcon}
                    alt="Reclaim Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className=" bg-white rounded-b-2xl border ">
                <div className="flex gap-4 items-start py-6 px-2">
                  <div className="shrink-0">
                    <Calendar size={24} className="text-purple-600" />
                  </div>

                  <div>
                    <div className="flex items-start gap-2">
                      <h2 className="text-sm font-semibold text-black flex items-center gap-2">
                        Automate and Optimize Your Schedule
                      </h2>
                    </div>

                    <p className="text-sm text-gray-900 mt-1">
                      Reclaim.ai is an AI-powered calendar assistant that
                      automatically schedules your tasks, meetings, and breaks
                      to boost productivity. Free to try — earn Flowva Points
                      when you sign up!
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-3 border-t pt-4 px-2 pb-4">
                  <button
                    onClick={() =>
                      window.open(
                        "https://go.reclaim.ai/ur9i6g5eznps",
                        "_blank"
                      )
                    }
                    className="flex justify-center items-center gap-2 w-28 text-white bg-purple-500 py-1 rounded-3xl font-medium"
                  >
                    <FaUserPlus size={18} /> Sign up
                  </button>

                  <button
                    onClick={() => setOpen(true)}
                    className="bg-gradient-to-r from-purple-700  to-orange-300 w-32 flex items-center justify-center gap-2 text-white py-1 rounded-3xl font-medium"
                  >
                    <GiftIcon size={18} /> Claim 50 pts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Refer & Earn  */}
        <section className="space-y-8">
          <div className="w-[70%] ">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-purple-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">
                Earn More Points
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Refer and Win Card */}
              <div
                className="bg-gray-50 rounded-2xl border transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg hover:border-purple-600"
              >
                <div className="flex items-start gap-3 mb-4 bg-white p-4 rounded-2xl border-t border-b border-gray-200 rounded-b-none">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Star className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-md">
                    Refer and win 10,000 points!
                  </h3>
                </div>

                <p className="text-sm text-gray-600 px-4">
                  Invite 3 friends by Nov 20 and earn a chance to be one of 5
                  winners of{" "}
                  <span className="text-purple-600 font-semibold">
                    10,000 points
                  </span>
                  . Friends must complete onboarding to qualify.
                </p>
              </div>

              {/* Share Your Stack Card */}
              <div
                className="bg-gray-50 rounded-2xl border transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg hover:border-purple-600"
              >
                <div
                  className="flex items-start gap-3 mb-4 p-4 bg-white
                border-t border-b border-gray-200
                rounded-2xl rounded-b-none"
                >
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Share2 className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-md">Share Your Stack</h3>
                    <p className="text-sm text-gray-600">Earn +25 pts</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <p className="text-sm text-gray-700">Share your tool stack</p>
                  <button
                    onClick={() => setOpenShareStack(true)}
                    className="flex items-center gap-2 text-purple-600 font-semibold rounded-3xl bg-blue-100 hover:bg-purple-700 px-4 py-2 hover:text-white transition"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Refer & Earn Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-purple-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Refer & Earn</h2>
            </div>

            <div
              className="bg-white rounded-2xl border transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-purple-50 p-6 flex items-center gap-3">
                <Users className="text-purple-600" />
                <div>
                  <h3 className="font-semibold">Share Your Link</h3>
                  <p className="text-sm text-gray-600">
                    Invite friends and earn 25 points when they join!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 text-center py-10">
                <div>
                  <p className="text-4xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Referrals</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Points Earned</p>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                <p className="text-sm text-gray-700">
                  Your personal referral link:
                </p>

                <div className="relative">
                  <input
                    readOnly
                    value={referralLink}
                    className="w-full px-4 py-3 pr-12 border rounded-xl bg-gray-50 text-sm"
                  />

                  <button
                    onClick={handleCopy}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition
                  ${
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }
                `}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center gap-3 pt-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      referralLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      referralLink
                    )}&text=Check out this awesome tool!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      referralLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      "Check out this awesome tool! " + referralLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
