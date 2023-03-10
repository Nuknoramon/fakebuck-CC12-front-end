import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { TransactionContextProvider } from "./contexts/TransactionContext";
import Home from "./pages/Home";
import TransactionAction from "./pages/TransactionAction";

function App() {
  return (
    <TransactionContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="new" element={<TransactionAction />} />
          <Route
            path="transaction/:transactionId"
            element={<TransactionAction />}
          />
          {/* <Route
            index
            // element={<div className="text-white">This is Default Page</div>}
            element={<Navigate to="/home" />}
          />
          {/* <Route
        path="*"
        element={
          <div className="text-white text-center">
            <h1>404 Not Found !!!</h1>
          </div>
        }
      /> */}
        </Route>
        {/* <Route path="*" element={<Navigate to="/home" />} /> */}
      </Routes>
    </TransactionContextProvider>
  );
}

export default App;
