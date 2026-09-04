import { useState } from "react";
import { sendAIMessage } from "../api/resqTwinApi";
import "./AIChat.css";
import AIChat from "./pages/AIChat";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your DisasterConnect AI Assistant. Ask me anything about flood safety, evacuation, emergency preparedness, or disaster response.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await sendAIMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I could not connect to the AI assistant. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-container">

        <div className="ai-chat-header">
          <div>
            <h1>🤖 DisasterConnect AI</h1>
            <p>Your AI-powered disaster safety assistant</p>
          </div>

          <span className="ai-status">
            ● Online
          </span>
        </div>

        <div className="chat-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <div className="message-label">
                {message.role === "user"
                  ? "You"
                  : "DisasterConnect AI"}
              </div>

              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-label">
                DisasterConnect AI
              </div>

              <div className="message-content thinking">
                AI is thinking...
              </div>
            </div>
          )}

        </div>

        <div className="chat-input-area">

          <input
            type="text"
            placeholder="Ask about disaster safety..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSendMessage}
            disabled={loading}
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}

export default AIChat;