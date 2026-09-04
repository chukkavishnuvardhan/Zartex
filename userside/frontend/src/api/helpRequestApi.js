const API_URL = "http://127.0.0.1:8000/api/help-requests";

export async function createHelpRequest(requestData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error("Failed to submit help request");
  }

  return response.json();
}