import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const mockDrinks = [
  { name: "Beer", points: 1 },
  { name: "Wine", points: 1.5 },
  { name: "Shot", points: 2 },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    if (!loggedIn) return;

    fetchLeaderboard();

    const channel = supabase
      .channel("realtime-drinks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drinks",
        filter: `groupcode=eq.${groupCode}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loggedIn]);

  const handleLogin = () => {
    if (!username || !groupCode) return;
    setLoggedIn(true);
  };

  const addDrink = async (drink) => {
    await supabase.from("drinks").insert([
      {
        username,
        group_code: groupCode,
        drink_type: drink.name,
        points: drink.points,
      },
    ]);
  };

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("drinks")
      .select("*")
      .eq("group_code", groupCode);

    if (error) {
      console.error("Error fetching drinks:", error);
      return;
    }

    const grouped = {};
    data.forEach((entry) => {
      if (!grouped[entry.username]) grouped[entry.username] = 0;
      grouped[entry.username] += entry.points;
    });

    setLeaderboard(grouped);
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
        <h1>Join a Drinking Group</h1>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />
        <input
          placeholder="Group Invite Code"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <button onClick={handleLogin}>Enter Group</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Welcome, {username}</h1>
      <p>Group: {groupCode}</p>

      {mockDrinks.map((drink) => (
        <button
          key={drink.name}
          onClick={() => addDrink(drink)}
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          I drank a {drink.name} (+{drink.points} pts)
        </button>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <h2>Leaderboard</h2>
        <ul>
          {Object.entries(leaderboard)
            .sort((a, b) => b[1] - a[1])
            .map(([user, points]) => (
              <li key={user}>
                {user}: {points} pts
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
