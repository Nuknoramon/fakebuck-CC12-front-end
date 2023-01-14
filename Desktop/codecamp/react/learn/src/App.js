import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countActions } from "./redux/store";
import "./App.css";

// ACTION: INCREASE, DECREASE
// function reducerFunction(state, action) {
//   switch (action.type) {
//     case "INCREASE":
//       return { count: state.count + 1 };
//     case "DECREASE":
//       return { count: state.count - 1 };
//     default:
//       return state;
//   }
// }

// function App() {
//   const [state, dispatch] = useReducer(reducerFunction, { count: 0 });
//   return (
//     <div className="App">
//       <h1>{state.count}</h1>
//       <button onClick={() => dispatch({ type: "INCREASE" })}>+</button>
//       <button onClick={() => dispatch({ type: "DECREASE" })}>-</button>
//     </div>
//   );
// }

function App() {
  const count = useSelector((state) => {
    console.log(state);
    return state.count.count;
  });

  const dispatch = useDispatch();

  return (
    <div className="App">
      <h1>{count}</h1>
      <button onClick={() => dispatch(countActions.increase())}>+</button>
      <button onClick={() => dispatch(countActions.decrease())}>-</button>
      <button onClick={() => dispatch(countActions.increase(2))}>
        increase by two
      </button>
    </div>
  );
}

export default App;
