import React, { useState, useEffect } from "react";

function App() {
  const [drinks, setDrinks] = useState({ beer: 0, wine: 0, liquor: 0 });
  const [bac, setBac] = useState(0);
  const [soberTime, setSoberTime] = useState(null);

  // Function to add a drink
  const addDrink = (type) => {
    setDrinks((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  // Mock function to calculate BAC
  const calculateBAC = () => {
    const totalDrinks = drinks.beer + drinks.wine + drinks.liquor;
    const estimatedBac = totalDrinks * 0.02; // Placeholder formula
    setBac(estimatedBac);

    if (estimatedBac > 0) {
      setSoberTime(Date.now() + estimatedBac * 60 * 60 * 1000); // BAC drops ~0.015/hour
    } else {
      setSoberTime(null);
    }
  };

  useEffect(() => {
    calculateBAC();
  }, [drinks]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>BAC Tracker</h1>
      <p>Track your drinks and estimated BAC</p>

      <div>
        <button onClick={() => addDrink("beer")}>Beer 🍺</button>
        <button onClick={() => addDrink("wine")}>Wine 🍷</button>
        <button onClick={() => addDrink("liquor")}>Liquor 🥃</button>
      </div>

      <h2>Drinks:</h2>
      <p>Beer: {drinks.beer} | Wine: {drinks.wine} | Liquor: {drinks.liquor}</p>

      <h2>Estimated BAC: {bac.toFixed(3)}</h2>

      {soberTime && (
        <p>Sober in: {new Date(soberTime).toLocaleTimeString()}</p>
      )}
    </div>
  );
}

export default App;