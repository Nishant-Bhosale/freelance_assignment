import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/Freelance_Assignment/server/")
      .then((res) => res.json())
      .then((d) => console.log(d))
      .catch((e) => console.log(e));
  }, []);
  return <div className="App"></div>;
}

export default App;
