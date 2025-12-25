import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function StreakCard() {
  const [streak, setStreak] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("streak, last_claim_date")
      .single();

    if (!data) return;

    setStreak(data.streak);
    setClaimed(data.last_claim_date === new Date().toISOString().split("T")[0]);
  };

  const claim = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!user) return;

    // get current points
    const { data: pData, error: pErr } = await supabase
      .from("profiles")
      .select("points")
      .single();
    const currentPoints = pData?.points ?? 0;
    const newPoints = currentPoints + 5;

    const { error } = await supabase
      .from("profiles")
      .update({ streak: streak + 1, points: newPoints, last_claim_date: today })
      .single();

    if (!error) {
      // log the points change
      await supabase
        .from("points_logs")
        .insert([{ user_id: user.id, action: "daily_claim", points: 5 }]);

      setStreak((s) => s + 1);
      setClaimed(true);

      // notify other components (simple pub/sub)
      window.dispatchEvent(
        new CustomEvent("pointsUpdated", { detail: newPoints })
      );
    }
  };

  return (
    <div className="card">
      <h3>Daily Streak</h3>
      <h1>{streak} days</h1>

      <button onClick={claim} disabled={claimed}>
        {claimed ? "Claimed Today" : "Claim +5 Points"}
      </button>
    </div>
  );
}
