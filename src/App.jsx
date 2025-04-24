import { useState } from "react";

const mockDrinks = [
  { name: "Beer", points: 1 },
  { name: "Wine", points: 1.5 },
  { name: "Shot", points: 2 },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [groupCode, setGroupCode] = useState("");
  const [drinks, setDrinks] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});

  const handleLogin = () => {
    if (!username || !groupCode) return;
    setLoggedIn(true);
    if (!leaderboard[groupCode]) {
      setLeaderboard({ ...leaderboard, [groupCode]: {} });
    }
  };

  const addDrink = (drink) => {
    const updatedLeaderboard = { ...leaderboard };
    if (!updatedLeaderboard[groupCode][username]) {
      updatedLeaderboard[groupCode][username] = 0;
    }
    updatedLeaderboard[groupCode][username] += drink.points;
    setLeaderboard(updatedLeaderboard);
    setDrinks([...drinks, drink]);
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Join a Drinking Group
        </h1>
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
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Welcome, {username}</h1>
      <p style={{ marginBottom: "1rem" }}>Group: {groupCode}</p>

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
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Leaderboard</h2>
        <ul>
          {Object.entries(leaderboard[groupCode] || {})
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
