import React, { useEffect, useState } from "react";
import { handleOutcome } from "./Helper";

const Game = ({ socket, username, room }) => {
  const [opponentId, setOpponentId] = useState("");
  const [userMove, setUserMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);

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
      console.log(res);
    }
  }, [userMove, opponentMove]);

  return (
    <>
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
