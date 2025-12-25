"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Calendar, Star, Share2, Copy, Check, GiftIcon } from "lucide-react";
import { FaBolt, FaStar, FaUserPlus } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import ReclaimIcon from "../assets/reclaim .png";
import ClaimPointsModal from "./claim-points-modal";

export default function EarnPoints() {
  const referralLink = "https://app.flowvahub.com/signup/?ref=james9062";
  const [copied, setCopied] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [claimedDates, setClaimedDates] = useState<Record<string, boolean>>({});
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [open, setOpen] = useState(false);

  // load profile and recent logs (last 7 days)
  const loadProfileAndLogs = async () => {
    setLoadingPoints(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("points, streak, last_claim_date")
        .single();
      if (profileError) throw profileError;
      if (profile?.points != null) setPoints(profile.points);
      setStreak(profile?.streak ?? 0);
      setLastClaimDate(profile?.last_claim_date ?? null);

      // get logs for the last 7 days
      const start = new Date();
      start.setDate(start.getDate() - 6);
      const { data: logs } = await supabase
        .from("points_logs")
        .select("created_at, action")
        .gte("created_at", start.toISOString());

      const map: Record<string, boolean> = {};
      if (logs && Array.isArray(logs)) {
        logs.forEach((l: any) => {
          if (!l?.created_at) return;
          const d = new Date(l.created_at).toISOString().slice(0, 10);
          map[d] = true;
        });
      }
      setClaimedDates(map);
    } catch (err) {
      setPoints(0);
    } finally {
      setLoadingPoints(false);
    }
  };

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

  // helpers for dates and claiming
  const daysBetween = (a: Date, b: Date) => {
    const _a = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const _b = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((+_a - +_b) / (1000 * 60 * 60 * 24));
  };

  const getLast7Days = () => {
    const arr: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d);
    }
    return arr;
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

  const claimForDate = async (d: Date) => {
    const dateStr = d.toISOString().slice(0, 10);
    if (claimedDates[dateStr]) return;
    setLoadingPoints(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = (userData as any)?.user;
      if (!user) throw new Error("Not authenticated");

      const payload: any = {
        user_id: user.id,
        action: "daily-claim",
        points: 5,
      };

      payload.created_at = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      ).toISOString();

      const { error: insertError } = await supabase
        .from("points_logs")
        .insert([payload]);
      if (insertError) throw insertError;

      const { data: prof } = await supabase
        .from("profiles")
        .select("points, streak, last_claim_date")
        .single();

      const currentPoints = (prof?.points ?? 0) as number;
      const currentStreak = (prof?.streak ?? 0) as number;
      const last = prof?.last_claim_date
        ? new Date(prof.last_claim_date)
        : null;

      let newStreak = 1;
      if (last) {
        const diff = daysBetween(d, last);
        if (diff === 1) {
          newStreak = currentStreak + 1;
        } else if (diff === 0) {
          newStreak = currentStreak;
        } else {
          newStreak = 1;
        }
      }

      const newPoints = currentPoints + 5;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          points: newPoints,
          streak: newStreak,
          last_claim_date: dateStr,
        })
        .eq("id", user.id);
      if (updateError) throw updateError;

      await loadProfileAndLogs();

      window.dispatchEvent(
        new CustomEvent("pointsUpdated", { detail: newPoints })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPoints(false);
    }
  };
  return (
    <>
      <ClaimPointsModal open={open} onClose={() => setOpen(false)} />
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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border">
              <div className="flex items-center gap-2 mb-4">
                <SlBadge color="purple" size={20} />
                <h3 className="font-semibold">Points Balance</h3>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl font-bold text-purple-600">
                  {loadingPoints ? "—" : points}
                </span>

                <div className="relative w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden animate-star">
                  <div className="absolute inset-1 rounded-full bg-yellow-300" />
                  <FaStar size={26} className="relative z-10 text-orange-500" />
                  <div className="wave-overlay absolute inset-0 z-20" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Progress to $5 Gift Card
                  </span>
                  <span className="font-semibold">
                    {loadingPoints ? "— / 5000" : `${points} / 5000`}
                  </span>
                </div>

                <div className="h-2 bg-white rounded-full overflow-hidden">
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
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-blue-500" size={20} />
                <h3 className="font-semibold">Daily Streak</h3>
              </div>

              <p className="text-5xl font-bold text-purple-600 mb-4">
                {loadingPoints
                  ? "—"
                  : `${streak} day${streak !== 1 ? "s" : ""}`}
              </p>

              <div className="flex gap-2 mb-4">
                {getLast7Days().map((d, i) => {
                  const dayLabel = d
                    .toLocaleDateString(undefined, { weekday: "short" })
                    .charAt(0);
                  const dateStr = d.toISOString().slice(0, 10);
                  const claimed = !!claimedDates[dateStr];
                  const today = isSameDay(d, new Date());
                  const yesterday = isYesterday(d);
                  const claimable = !claimed && (today || yesterday);

                  const cls = claimed
                    ? "bg-purple-600 text-white ring-2 ring-purple-300"
                    : claimable
                    ? "bg-blue-400 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500";

                  return (
                    <div
                      key={i}
                      onClick={() => claimable && claimForDate(d)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${cls}`}
                    >
                      {dayLabel}
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Check in daily to earn +5 points
              </p>

              {(() => {
                const today = new Date();
                const todayStr = today.toISOString().slice(0, 10);
                const claimedToday = !!claimedDates[todayStr];
                if (claimedToday) {
                  return (
                    <button className="w-full py-3 rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2">
                      <FaBolt />
                      Claimed Today
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => claimForDate(new Date())}
                    className="w-full py-3 rounded-xl bg-purple-500 text-white flex items-center justify-center gap-2"
                  >
                    <FaBolt />
                    Claim Today (+5 pts)
                  </button>
                );
              })()}
            </div>

            {/* Featured Tool */}
            <div className=" text-white  ">
              <div className="flex  justify-between items-center bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white p-4 rounded-t-2xl border">
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

              <div className=" bg-white rounded-b-2xl border">
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
                  <button className=" flex justify-center items-center gap-2  w-28 text-white bg-purple-500 py-1 rounded-3xl font-medium">
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

        {/*  Earn More Points  */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-purple-600 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">
              Earn More Points
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="text-purple-600" />
                </div>
                <h3 className="font-semibold">Refer and win 10,000 points!</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Share2 className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Share Your Stack</h3>
                  <p className="text-sm text-gray-600">Earn +25 pts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Refer & Earn  */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-purple-600 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">Refer & Earn</h2>
          </div>

          <div className="bg-white rounded-2xl border">
            <div className="bg-purple-50 p-6 flex items-center gap-3">
              <Share2 className="text-purple-600" />
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

            <div className="px-6 pb-6 space-y-3">
              <p className="text-sm text-gray-700">
                Your personal referral link:
              </p>

              {/* Copy input */}
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
