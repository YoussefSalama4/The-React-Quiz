export default function Progress({
  i,
  numQuestions,
  score,
  maxPossiblePoints,
  answer,
}) {
  return (
    <header className="progress">
      <progress
        value={i + Number(answer !== null)}
        max={numQuestions}
      ></progress>
      <p>
        Question <strong>{i + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{score}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}
