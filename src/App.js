import logo from "./logo.png";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>FEDORG</h1>
        <a
          className="App-link"
          href="https://amzn.eu/d/2rWwO3v"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy on amazon
        </a>
      </header>
    </div>
  );
}

export default App;
