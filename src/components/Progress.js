import { useQuiz } from "../contexts/QuizContext";

export default function Progress() {
  const {
    index: i,
    numQuestions,
    score,
    maxPossiblePoints,
    answer,
  } = useQuiz();
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
