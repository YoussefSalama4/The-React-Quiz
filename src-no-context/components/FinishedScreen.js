export default function FinishedScreen({
  score,
  maxPossiblePoints,
  highScore,
  dispatch,
}) {
  const percentage = Math.round((score / maxPossiblePoints) * 100);
  let emoji;
  if (percentage === 100) emoji = "🥇";
  else if (percentage >= 80) emoji = "🎉";
  else if (percentage >= 50) emoji = "🙋‍♂️";
  else if (percentage > 0) emoji = "🤔";
  else if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{score}</strong> out of{" "}
        {maxPossiblePoints} ({percentage}%)
      </p>
      <p className="highscore">(Highscore: {highScore})</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "reset" })}
      >
        Restart quiz
      </button>
    </>
  );
}
