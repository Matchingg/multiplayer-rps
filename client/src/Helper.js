export const handleOutcome = (userMove, opponentMove) => {
  if (userMove === "rock") {
    if (opponentMove === "scissors") {
      return "W";
    } else if (opponentMove === "paper") {
      return "L";
    } else {
      return "D";
    }
  } else if (userMove === "paper") {
    if (opponentMove === "rock") {
      return "W";
    } else if (opponentMove === "scissors") {
      return "L";
    } else {
      return "D";
    }
  } else {
    if (opponentMove === "paper") {
      return "W";
    } else if (opponentMove === "rock") {
      return "L";
    } else {
      return "D";
    }
  }
};
