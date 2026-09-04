import "./Dashboard.css";

function Dashboard({ userStatus, onRequestHelp, onAIChat }) {
  return (
    <div className="disaster-dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>🚨 DisasterConnect</h1>
          <p>Community disaster response and coordination platform</p>
        </div>

        <div className="dashboard-user-status">
          <span>{userStatus?.icon}</span>

          <div>
            <small>YOUR CURRENT STATUS</small>
            <strong>{userStatus?.title}</strong>
          </div>
        </div>
      </header>


      {/* WELCOME SECTION */}
      <section className="welcome-section">

        <div>
          <h2>Welcome to DisasterConnect</h2>

          <p>
            Connect with people, request help, find resources,
            and stay informed during emergencies.
          </p>
        </div>

        <div className="emergency-status">
          <span className="online-dot"></span>
          System Active
        </div>

      </section>


      {/* ACTION CARDS */}

      <section className="action-grid">

        <div className="action-card emergency">
          <div className="action-icon">🆘</div>

          <h3>Request Help</h3>

          <p>
            Send an emergency request to nearby volunteers
            and responders.
          </p>

          <button onClick={onRequestHelp}>
  Request Help
</button>
        </div>
        <div className="action-card ai-assistant">
  <div className="action-icon">🤖</div>

  <h3>AI Disaster Assistant</h3>

  <p>
    Ask questions and get instant disaster safety
    guidance powered by AI.
  </p>

  <button onClick={onAIChat}>
    Ask AI Assistant
  </button>
</div>


        <div className="action-card volunteer">
          <div className="action-icon">🤝</div>

          <h3>Volunteer</h3>

          <p>
            Offer your skills and help people affected
            by the disaster.
          </p>

          <button>Become a Volunteer</button>
        </div>


        <div className="action-card nearby">
          <div className="action-icon">📍</div>

          <h3>Nearby Help</h3>

          <p>
            View people nearby who need assistance
            or are offering help.
          </p>

          <button>View Nearby</button>
        </div>


        <div className="action-card shelter">
          <div className="action-icon">🏥</div>

          <h3>Shelters & Resources</h3>

          <p>
            Find nearby shelters, food, water
            and emergency resources.
          </p>

          <button>Find Resources</button>
        </div>

      </section>


      {/* FLOOD SIMULATION */}

      <section className="feature-section">

        <div className="feature-content">

          <div>
            <h2>🌊 Flood Risk Simulator</h2>

            <p>
              Monitor flood conditions, risk zones,
              blocked roads and affected areas.
            </p>
          </div>

          <button className="simulation-button">
            Open Flood Simulator
          </button>

        </div>

      </section>


      {/* COMMUNITY STATUS */}

      <section className="community-section">

        <h2>Community Overview</h2>

        <div className="community-grid">

          <div className="community-card">
            <span>🆘</span>
            <strong>0</strong>
            <p>Active Help Requests</p>
          </div>

          <div className="community-card">
            <span>🤝</span>
            <strong>0</strong>
            <p>Available Volunteers</p>
          </div>

          <div className="community-card">
            <span>🏠</span>
            <strong>0</strong>
            <p>Available Shelters</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;