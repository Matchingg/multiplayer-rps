import React, { useState } from "react";
import io from "socket.io-client";
import Game from "./Game";

const socket = io.connect("http://localhost:8080");

function App() {
  const [username, setUsername] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [room, setRoom] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [opponentId, setOpponentId] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      setSignedIn(true);
      socket.emit("join_room", { room, name: username });
    }
  };

  socket.once("game_start", (data) => {
    const oppId = data.roomIds.filter((item) => item !== socket.id);
    setOpponentId(oppId);
    setOpponentName(data.oppName);
    if (data.first) {
      const roomIds = [...data.roomIds];
      socket.emit("find_opponent", { username, roomIds, oppId });
    }
    setShowGame(true);
  });

  socket.on("full_room", (data) => {
    console.log(`Room ${data} is full`);
  });

  return (
    <>
      <div className="App">
        {!showGame ? (
          <div className="joinGameContainer">
            <h3 className="title">Join a Game</h3>
            <input
              className="input"
              type="text"
              placeholder="Name"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              className="input"
              type="text"
              placeholder="Room ID"
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button className="submit" onClick={joinRoom}>
              Join a Room
            </button>
            {signedIn ? <p>Waiting for opponent...</p> : null}
          </div>
        ) : (
          <Game
            socket={socket}
            username={username}
            room={room}
            opponentId={opponentId}
            opponentName={opponentName}
          />
        )}
      </div>
    </>
  );
}

export default App;
