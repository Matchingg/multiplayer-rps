import React, { useState } from "react";
import io from "socket.io-client";
import Game from "./Game";

const socket = io.connect("http://localhost:8080");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showGame, setShowGame] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowGame(true);
    }
  };
  return (
    <div className="App">
      {!showGame ? (
        <div className="joinChatContainer">
          <h3>Join a Game</h3>
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <Game socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
