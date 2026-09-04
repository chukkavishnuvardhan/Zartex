import { useState } from "react";
import { createHelpRequest } from "../api/helpRequestApi";
import "./RequestHelp.css";
function RequestHelp({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    emergencyType: "",
    peopleCount: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

async function handleSubmit(event) {
  event.preventDefault();

  setIsSubmitting(true);
  setSuccessMessage("");
  setErrorMessage("");

  try {
    const requestData = {
      ...formData,
      peopleCount: Number(formData.peopleCount),
    };

    const response = await createHelpRequest(requestData);

    setSuccessMessage(
      `Help request sent successfully! Request ID: ${response.id}`
    );

    setFormData({
      name: "",
      location: "",
      emergencyType: "",
      peopleCount: "",
      description: "",
    });

  } catch (error) {

    console.error(error);

    setErrorMessage(
      "Unable to send help request. Please try again."
    );

  } finally {

    setIsSubmitting(false);

  }
}

  return (
    <div className="request-help-page">

      <header className="request-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <h1>🆘 Request Emergency Help</h1>

        <p>
          Share your situation so nearby volunteers and responders can assist you.
        </p>
      </header>

      <div className="help-form-container">

        <form onSubmit={handleSubmit}>
            {successMessage && (
  <div className="success-message">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="error-message">
    {errorMessage}
  </div>
)}

          <div className="form-group">
            <label>Your Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Current Location</label>

            <input
              type="text"
              name="location"
              placeholder="Example: Ghatkesar, Hyderabad"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Emergency Type</label>

            <select
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleChange}
              required
            >
              <option value="">Select emergency type</option>

              <option value="flood">Flood</option>
              <option value="medical">Medical Emergency</option>
              <option value="trapped">Trapped / Rescue Needed</option>
              <option value="food">Food / Water Needed</option>
              <option value="shelter">Shelter Needed</option>
              <option value="other">Other</option>
            </select>
          </div>


          <div className="form-group">
            <label>Number of People</label>

            <input
              type="number"
              name="peopleCount"
              placeholder="How many people need help?"
              value={formData.peopleCount}
              onChange={handleChange}
              min="1"
              required
            />
          </div>


          <div className="form-group">
            <label>Describe Your Situation</label>

            <textarea
              name="description"
              placeholder="Describe what happened and what help you need..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>


         <button
  type="submit"
  className="submit-help-button"
  disabled={isSubmitting}
>
  {isSubmitting
    ? "Sending Request..."
    : "🆘 Send Help Request"}
</button>

        </form>

      </div>

    </div>
  );
}

export default RequestHelp;