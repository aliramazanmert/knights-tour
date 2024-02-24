import { useState } from "react";
import "./App.css";
import KnightsTour from "./KnightsTour";

const App = () => {
  const [key, setKey] = useState(0);

  const remount = () => {
    setKey((prev) => prev + 1);
  };
  return <KnightsTour key={key} remount={remount} />;
};

export default App;
