import "./SafetyStatus.css";

function SafetyStatus({ onSelectStatus }) {
  const statuses = [
    {
      id: "critical",
      icon: "🔴",
      title: "Immediate Help Needed",
      description: "I am in danger and need urgent assistance.",
    },
    {
      id: "needs-help",
      icon: "🟠",
      title: "Need Assistance",
      description: "I need help but my situation is not immediately critical.",
    },
    {
      id: "affected",
      icon: "🟡",
      title: "Affected but Safe",
      description: "I am affected by the disaster but currently safe.",
    },
    {
      id: "safe",
      icon: "🟢",
      title: "I am Safe",
      description: "I am safe and want to update my status.",
    },
    {
      id: "volunteer",
      icon: "🔵",
      title: "I Want to Volunteer",
      description: "I am available to help people in my area.",
    },
  ];

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="brand">
          <h1>DisasterConnect</h1>
          <p>Connecting people when disaster strikes.</p>
        </div>

        <div className="status-content">
          <h2>What is your current situation?</h2>
          <p className="subtitle">
            Select the option that best describes your current condition.
          </p>

          <div className="status-grid">
            {statuses.map((status) => (
              <button
                key={status.id}
                className="status-card"
                onClick={() => onSelectStatus(status)}
              >
                <span className="status-icon">{status.icon}</span>

                <div>
                  <h3>{status.title}</h3>
                  <p>{status.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetyStatus;