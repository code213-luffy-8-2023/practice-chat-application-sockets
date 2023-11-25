import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const handler = (data) => {
      setMessages((messages) => [...messages, data]);
    };
    socket.on("chat message", handler);
    return () => {
      socket.off("chat message", handler);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("chat message", { username, message });
      setMessage("");
    }
  };

  const enterChat = () => {
    if (username) {
      setHasEntered(true);
    }
  };

  if (!hasEntered) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enterChat();
        }}
        className="name-form"
      >
        <h1>Welcome to chat</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="name"
        />
        <button className="enter-btn">Enter Chat</button>
      </form>
    );
  }

  return (
    <div id="chat-container">
      <h1>Chat</h1>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li
            className={
              msg.username === username
                ? "me"
                : msg.username == "System"
                ? "system"
                : ""
            }
            key={index}
          >
            <strong>{msg.username}:</strong> {msg.message}
          </li>
        ))}{" "}
      </ul>
      <form id="form" onSubmit={sendMessage}>
        <input
          id="input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
