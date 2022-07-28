import React, { useEffect, useState } from "react";
import { handleOutcome } from "./Helper";

const Game = ({ socket, username, room, opponentId }) => {
  const [userMove, setUserMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [userWins, setUserWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);

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
    <div>
      <div className="scores">
        <div>You: {userWins}</div>
        <div>Opponent: {opponentWins}</div>
      </div>
      <div className="Game">
        {!userMove ? (
          <div className="options">
            <button
              className="button-option"
              type="submit"
              onClick={() => handleMove("rock")}
            >
              Rock
            </button>
            <button
              className="button-option"
              type="submit"
              onClick={() => handleMove("paper")}
            >
              Paper
            </button>
            <button
              className="button-option"
              type="submit"
              onClick={() => handleMove("scissors")}
            >
              Scissors
            </button>
          </div>
        ) : (
          <div>
            <div className="user-move">{userMove}</div>
          </div>
        )}
        {opponentMove ? (
          <div className="opponent-move">{opponentMove}</div>
        ) : (
          <div>
            <div className="opponent-move-text">Opponent is making a move</div>
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
