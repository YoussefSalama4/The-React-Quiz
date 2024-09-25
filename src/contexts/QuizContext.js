import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //loading error ready active finished
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? state.score + question.points
            : state.score,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.score > state.highScore ? state.score : state.highScore,
      };
    case "reset":
      return {
        ...state,
        answer: null,
        status: "active",
        index: 0,
        score: 0,
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "tick":
      const timeOver = state.secondsRemaining === 0;
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: timeOver ? "finished" : state.status,
        highScore: timeOver
          ? state.score > state.highScore
            ? state.score
            : state.highScore
          : state.highScore,
      };
    default:
      throw new Error("action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, score, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  const numQuestions = questions.length;
  const question = questions[index];
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        score,
        highScore,
        secondsRemaining,
        dispatch,
        maxPossiblePoints,
        numQuestions,
        question,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error("context was used outsize provider scope");
  }
  return context;
}

export { useQuiz, QuizProvider };
