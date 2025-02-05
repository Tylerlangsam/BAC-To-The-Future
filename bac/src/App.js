import React, { useState, useEffect } from "react";

function App() {
  const [drinks, setDrinks] = useState({ beer: 0, wine: 0, liquor: 0 });
  const [totalAlcoholGrams, setTotalAlcoholGrams] = useState(0);
  const [weightLbs, setWeightLbs] = useState(160);
  const [gender, setGender] = useState("male");
  const [bac, setBac] = useState(0);
  const [soberTime, setSoberTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Alcohol content in grams for each drink type (not accurate)
  const alcoholContentGrams = {
    beer: 14,
    wine: 14,
    liquor: 14,
  };

  const addDrink = (type) => {
    setDrinks(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setTotalAlcoholGrams(prev => prev + alcoholContentGrams[type]);

    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  useEffect(() => {
    const calculateBAC = () => {
      if (totalAlcoholGrams === 0) {
        setBac(0);
        setSoberTime(null);
        return;
      }

      // Convert total alcohol from grams to ounces.
      const totalAlcoholOunces = totalAlcoholGrams / 28.35;
      const r = gender === "male" ? 0.68 : 0.55;
      
      // Widmark formula: A in ounces.
      const bacValue = (totalAlcoholOunces * 5.14) / (weightLbs * r);

      // Calculate hours passed since first drink.
      const hoursPassed = startTime ? (Date.now() - startTime) / (1000 * 60 * 60) : 0;
      const adjustedBac = Math.max(bacValue - 0.015 * hoursPassed, 0);

      setBac(adjustedBac);

      if (adjustedBac > 0) {
        const hoursUntilSober = adjustedBac / 0.015;
        setSoberTime(Date.now() + hoursUntilSober * 60 * 60 * 1000);
      } else {
        setSoberTime(null);
      }
    };

    calculateBAC();
  }, [totalAlcoholGrams, weightLbs, gender, startTime]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>BAC Tracker</h1>
      <div>
        <label>
          Weight (lbs):{" "}
          <input
            type="number"
            value={weightLbs}
            onChange={(e) => setWeightLbs(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Gender:{" "}
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => addDrink("beer")}>Beer 🍺</button>
        <button onClick={() => addDrink("wine")}>Wine 🍷</button>
        <button onClick={() => addDrink("liquor")}>Liquor 🥃</button>
      </div>
      <h2>Drinks Consumed:</h2>
      <p>
        Beer: {drinks.beer} | Wine: {drinks.wine} | Liquor: {drinks.liquor}
      </p>
      <h2>Estimated BAC: {bac.toFixed(3)}</h2>
      {soberTime && <p>Sober in: {new Date(soberTime).toLocaleTimeString()}</p>}
    </div>
  );
}

export default App;