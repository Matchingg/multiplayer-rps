import React, { useEffect, useState } from "react";
import { handleOutcome } from "./Helper";

const Game = ({ socket, username, room }) => {
  const [opponentId, setOpponentId] = useState("");
  const [userMove, setUserMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [userWins, setUserWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);

  socket.once("game_start", (data) => {
    const oppId = data.roomIds.filter((item) => item !== socket.id);
    setOpponentId(oppId);
    if (data.first) {
      const roomIds = [...data.roomIds];
      socket.emit("find_opponent", { roomIds, oppId });
    }
  });

  const handleMove = (move) => {
    setUserMove(move);
    socket.emit("send_move", { move, opponentId });
  };

  socket.on("receive_move", (data) => {
    setOpponentMove(data);
  });

  useEffect(() => {
    if (userMove && opponentMove) {
      const res = handleOutcome(userMove, opponentMove);
      setUserMove(null);
      setOpponentMove(null);
      handleScore(res);
    }
  }, [userMove, opponentMove]);

  const handleScore = (res) => {
    if (res === "W") {
      setUserWins((value) => value + 1);
    } else if (res === "L") {
      setOpponentWins((value) => value + 1);
    }
  };

  return (
    <>
      <div>
        <div>You: {userWins}</div>
        <div>Opponent: {opponentWins}</div>
      </div>
      {!userMove ? (
        <div>
          <button type="submit" onClick={() => handleMove("rock")}>
            Rock
          </button>
          <button type="submit" onClick={() => handleMove("paper")}>
            Paper
          </button>
          <button type="submit" onClick={() => handleMove("scissors")}>
            Scissors
          </button>
        </div>
      ) : (
        <p>{userMove}</p>
      )}
    </>
  );
};

export default Game;
