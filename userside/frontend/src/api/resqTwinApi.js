const API_BASE_URL = "http://127.0.0.1:8000";

export async function simulateFlood(waterLevel) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/flood/simulate?water_level=${waterLevel}`
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Flood API Error:", error);
    throw error;
  }
}
export async function sendAIMessage(message) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI Backend error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
}