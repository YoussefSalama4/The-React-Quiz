import { useQuiz } from "../contexts/QuizContext";

export default function Options() {
  const { question, dispatch, answer } = useQuiz();
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, i) => (
        <button
          onClick={() => dispatch({ type: "newAnswer", payload: i })}
          key={option}
          disabled={hasAnswered}
          className={`btn btn-option ${
            hasAnswered
              ? i === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          } ${i === answer ? "answer" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
