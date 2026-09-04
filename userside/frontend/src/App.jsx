import { useState } from "react";
import SafetyStatus from "./pages/SafetyStatus";
import Dashboard from "./pages/Dashboard";
import RequestHelp from "./pages/RequestHelp";
import "./App.css";
from app.models.emergency import EmergencyRequest, EmergencyResponse
const buildings = [
  {
    id: "B1",
    name: "Block A",
    x: 100,
    y: 90,
    width: 150,
    height: 90,
    population: 180,
    elevation: 8,
  },
  {
    id: "B2",
    name: "Block B",
    x: 420,
    y: 90,
    width: 150,
    height: 90,
    population: 250,
    elevation: 6,
  },
  {
    id: "B3",
    name: "Block C",
    x: 100,
    y: 310,
    width: 150,
    height: 90,
    population: 160,
    elevation: 4,
  },
  {
    id: "B4",
    name: "Block D",
    x: 420,
    y: 310,
    width: 150,
    height: 90,
    population: 220,
    elevation: 3,
  },
];

const roads = [
  {
    id: "R1",
    x1: 175,
    y1: 135,
    x2: 495,
    y2: 135,
    elevation: 7,
  },
  {
    id: "R2",
    x1: 175,
    y1: 135,
    x2: 175,
    y2: 355,
    elevation: 5,
  },
  {
    id: "R3",
    x1: 495,
    y1: 135,
    x2: 495,
    y2: 355,
    elevation: 4,
  },
  {
    id: "R4",
    x1: 175,
    y1: 355,
    x2: 495,
    y2: 355,
    elevation: 2,
  },
];

const exits = [
  {
    id: "E1",
    name: "Exit A",
    x: 45,
    y: 135,
  },
  {
    id: "E2",
    name: "Exit B",
    x: 625,
    y: 135,
  },
  {
    id: "E3",
    name: "Exit C",
    x: 625,
    y: 355,
  },
];

const shelters = [
  {
    id: "S1",
    name: "Shelter A",
    x: 120,
    y: 485,
    capacity: 250,
    occupancy: 80,
  },
  {
    id: "S2",
    name: "Shelter B",
    x: 500,
    y: 485,
    capacity: 400,
    occupancy: 120,
  },
];

function getRisk(building, waterLevel) {
  const difference = waterLevel - building.elevation;

  if (difference <= 0) {
    return {
      score: 15,
      level: "LOW",
    };
  }

  const score = Math.min(
    100,
    Math.round(35 + difference * 20 + building.population / 30)
  );

  if (score >= 80) {
    return {
      score,
      level: "CRITICAL",
    };
  }

  if (score >= 60) {
    return {
      score,
      level: "HIGH",
    };
  }

  if (score >= 30) {
    return {
      score,
      level: "MEDIUM",
    };
  }

  return {
    score,
    level: "LOW",
  };
}

function App() {
  const [waterLevel, setWaterLevel] = useState(1.5);
  const [currentScreen, setCurrentScreen] = useState("safety");
const [userStatus, setUserStatus] = useState(null);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [floodResult, setFloodResult] = useState(null);
const [loading, setLoading] = useState(false);
const [apiError, setApiError] = useState("");
async function handleSimulate() {
  try {
    setLoading(true);
    setApiError("");

    const result = await simulateFlood(waterLevel);

    console.log("Flood API result:", result);

    setFloodResult(result);
    setSimulationStarted(true);
  } catch (error) {
    console.error(error);
    setApiError("Unable to connect to backend");
  } finally {
    setLoading(false);
  }
}
  const riskResults = buildings.map((building) => ({
    ...building,
    risk: getRisk(building, waterLevel),
    flooded: waterLevel >= building.elevation,
  }));

  const peopleAtRisk = riskResults
    .filter((building) => building.flooded)
    .reduce((total, building) => total + building.population, 0);

  const highestRisk = Math.max(
    ...riskResults.map((building) => building.risk.score)
  );

  const blockedRoads = roads.filter(
    (road) => waterLevel >= road.elevation
  ).length;

  function startSimulation() {
    setSimulationStarted(true);
  }

  function resetSimulation() {
    setWaterLevel(1.5);
    setSimulationStarted(false);
    setSelectedBuilding(null);
  }
  function handleStatusSelection(status) {
  setUserStatus(status);
  setCurrentScreen("dashboard");
}
function openRequestHelp() {
  setCurrentScreen("request-help");
}

function goToDashboard() {
  setCurrentScreen("dashboard");
}
function openAIChat() {
  setCurrentScreen("ai-chat");
}

  if (currentScreen === "safety") {
  return (
    <SafetyStatus onSelectStatus={handleStatusSelection} />
  );
}
if (currentScreen === "dashboard") {
  return (
    <Dashboard
      userStatus={userStatus}
      onRequestHelp={openRequestHelp}
      onAIChat={openAIChat}
    />
  );
}
if (currentScreen === "request-help") {
  return (
    <RequestHelp onBack={goToDashboard} />
  );
}
if (currentScreen === "ai-chat") {
  return (
    <AIChat onBack={goToDashboard} />
  );
}

return (
  <div className="app">

      {/* HEADER */}

      <header className="topbar">
  <div>
    <h1>🚨 DisasterConnect</h1>
    <p>Disaster response, safety and community coordination</p>
  </div>

  <div className="header-actions">
    <div className="user-status">
      <span>{userStatus?.icon}</span>
      <div>
        <small>YOUR STATUS</small>
        <strong>{userStatus?.title}</strong>
      </div>
    </div>

    <div className="system-status">
      <span className="status-dot"></span>
      ONLINE
    </div>
  </div>
</header>

      {/* MAIN LAYOUT */}

      <div className="dashboard">

        {/* LEFT CONTROL PANEL */}

        <aside className="control-panel">

          <div className="panel">
            <h2>🌊 Flood Simulation</h2>

            <p className="description">
              Simulate changing flood conditions across the campus.
            </p>

            <label>
              Water Level
            </label>

            <div className="water-value">
              {waterLevel.toFixed(1)} m
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={waterLevel}
              onChange={(event) =>
                setWaterLevel(Number(event.target.value))
              }
            />

            <div className="range-labels">
              <span>0m</span>
              <span>5m</span>
              <span>10m</span>
            </div>

            <button
  className="primary-button"
  onClick={handleSimulate}
  disabled={loading}
>
  {loading ? "Simulating..." : "🌊 Simulate Flood"}
</button>
{apiError && (
  <div className="api-error">
    {apiError}
  </div>
)}

{floodResult && (
  <div className="api-result">
    <strong>Backend Connected ✓</strong>

    <pre>
      {JSON.stringify(floodResult, null, 2)}
    </pre>
  </div>
)}

            <button
              className="secondary-button"
              onClick={resetSimulation}
            >
              Reset
            </button>

            {simulationStarted && (
              <div className="simulation-running">
                ● Simulation active
              </div>
            )}
          </div>

          {/* RISK SUMMARY */}

          <div className="panel">
            <h2>⚠️ Risk Summary</h2>

            <div className="mini-stat">
              <span>Highest Risk</span>
              <strong>{highestRisk}%</strong>
            </div>

            <div className="mini-stat">
              <span>People at Risk</span>
              <strong>{peopleAtRisk}</strong>
            </div>

            <div className="mini-stat">
              <span>Blocked Roads</span>
              <strong>{blockedRoads}</strong>
            </div>
          </div>

        </aside>

        {/* DIGITAL TWIN */}

        <section className="map-section">

          <div className="map-header">
            <div>
              <h2>🗺️ Campus Digital Twin</h2>
              <p>Live flood environment</p>
            </div>

            <div className="flood-indicator">
              🌊 {waterLevel.toFixed(1)}m
            </div>
          </div>

          <div className="map-container">

            <svg
              viewBox="0 0 680 550"
              className="campus-map"
            >

              {/* CAMPUS BACKGROUND */}

              <rect
                x="10"
                y="10"
                width="660"
                height="530"
                rx="20"
                className="campus-background"
              />

              {/* ROADS */}

              {roads.map((road) => {

                const blocked =
                  waterLevel >= road.elevation;

                return (
                  <line
                    key={road.id}
                    x1={road.x1}
                    y1={road.y1}
                    x2={road.x2}
                    y2={road.y2}
                    className={
                      blocked
                        ? "road blocked-road"
                        : "road"
                    }
                  />
                );
              })}

              {/* BUILDINGS */}

              {riskResults.map((building) => {

                const isSelected =
                  selectedBuilding?.id === building.id;
  

                return (
                  <g
                    key={building.id}
                    onClick={() =>
                      setSelectedBuilding(building)
                    }
                    className="building-group"
                  >

                    <rect
                      x={building.x}
                      y={building.y}
                      width={building.width}
                      height={building.height}
                      className={`
                        building
                        ${building.risk.level.toLowerCase()}
                        ${building.flooded ? "flooded" : ""}
                        ${isSelected ? "selected" : ""}
                      `}
                    />

                    <text
                      x={building.x + 12}
                      y={building.y + 25}
                      className="building-name"
                    >
                      {building.name}
                    </text>

                    <text
                      x={building.x + 12}
                      y={building.y + 48}
                      className="building-population"
                    >
                      👥 {building.population}
                    </text>

                    <text
                      x={building.x + 12}
                      y={building.y + 72}
                      className="building-risk"
                    >
                      Risk {building.risk.score}%
                    </text>

                  </g>
                );
              })}

              {/* EXITS */}

              {exits.map((exit) => (
                <g key={exit.id}>

                  <circle
                    cx={exit.x}
                    cy={exit.y}
                    r="15"
                    className="exit-marker"
                  />

                  <text
                    x={exit.x - 25}
                    y={exit.y - 23}
                    className="map-label"
                  >
                    🚪 {exit.name}
                  </text>

                </g>
              ))}

              {/* SHELTERS */}

              {shelters.map((shelter) => (
                <g key={shelter.id}>

                  <rect
                    x={shelter.x - 45}
                    y={shelter.y - 20}
                    width="90"
                    height="40"
                    rx="10"
                    className="shelter-marker"
                  />

                  <text
                    x={shelter.x - 32}
                    y={shelter.y + 5}
                    className="shelter-text"
                  >
                    🏠
                  </text>

                  <text
                    x={shelter.x - 25}
                    y={shelter.y + 34}
                    className="map-label"
                  >
                    {shelter.name}
                  </text>

                </g>
              ))}

              {/* HOSPITAL */}

              <g>

                <rect
                  x="555"
                  y="45"
                  width="90"
                  height="40"
                  rx="10"
                  className="hospital-marker"
                />

                <text
                  x="570"
                  y="72"
                  className="hospital-text"
                >
                  🏥 Hospital
                </text>

              </g>

            </svg>

          </div>

        </section>

        {/* RIGHT SIDE INFORMATION */}

        <aside className="right-panel">

          {/* LIVE STATUS */}

          <div className="panel">

            <h2>📊 Live Status</h2>

            <div className="status-card">
              <span>Flood Level</span>
              <strong>{waterLevel.toFixed(1)}m</strong>
            </div>

            <div className="status-card">
              <span>People at Risk</span>
              <strong>{peopleAtRisk}</strong>
            </div>

            <div className="status-card">
              <span>Blocked Roads</span>
              <strong>{blockedRoads}</strong>
            </div>

            <div className="status-card">
              <span>Highest Risk</span>
              <strong>{highestRisk}%</strong>
            </div>

          </div>

          {/* SELECTED BUILDING */}

          <div className="panel">

            <h2>🏢 Zone Details</h2>

            {selectedBuilding ? (
              <div>

                <h3>
                  {selectedBuilding.name}
                </h3>

                <p>
                  Population:{" "}
                  <strong>
                    {selectedBuilding.population}
                  </strong>
                </p>

                <p>
                  Elevation:{" "}
                  <strong>
                    {selectedBuilding.elevation}m
                  </strong>
                </p>

                <p>
                  Risk:{" "}
                  <strong>
                    {selectedBuilding.risk.score}%
                  </strong>
                </p>

                <div
                  className={`risk-badge ${selectedBuilding.risk.level.toLowerCase()}`}
                >
                  {selectedBuilding.risk.level}
                </div>

              </div>
            ) : (
              <p className="description">
                Click a building on the Digital Twin
                to inspect its risk.
              </p>
            )}

          </div>

          {/* AI RECOMMENDATION */}

          <div className="panel recommendation">

            <h2>🧠 AI Recommendation</h2>

            {highestRisk >= 80 ? (
              <p>
                🔴 Critical flood risk detected.
                Prioritize evacuation from the
                highest-risk zones.
              </p>
            ) : highestRisk >= 60 ? (
              <p>
                🟠 High-risk zones detected.
                Prepare evacuation routes and
                monitor water levels.
              </p>
            ) : (
              <p>
                🟢 Current campus conditions are
                relatively safe. Continue monitoring
                flood levels.
              </p>
            )}

          </div>

        </aside>

      </div>

    </div>
  );
}

export default App;