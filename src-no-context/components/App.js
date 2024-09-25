import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Timer from "./Timer";
import Footer from "./Footer";

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
export default function App() {
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  const [
    { questions, status, index, answer, score, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={questions.length} />
        )}
        {status === "error" && <Error />}
        {status === "active" && (
          <>
            <Progress
              numQuestions={questions.length}
              i={index}
              score={score}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              answer={answer}
              dispatch={dispatch}
              question={questions[index]}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                i={index}
                numQuestions={questions.length}
                dispatch={dispatch}
                answer={answer}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishedScreen
            highScore={highScore}
            score={score}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
