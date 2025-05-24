import logo from "./assets/logo.svg";
import "./App.css";
import { usePwaPrompt } from "../";

function App() {
  const { supported, installed, install } = usePwaPrompt();
  const isSupported = supported();
  const isInstalled = installed(true);
  const handleOnInstall = async () => {
    const isDone = await install();
    if (isDone) {
      console.log("pwa installation done");
    } else {
      console.log("pwa installation cancelled");
    }
  };

  return (
    <>
      <div>
        <a href="/">
          <img src={logo} className="logo" alt="Demo PWA logo" />
        </a>
      </div>
      <h1>React Prompt PWA</h1>
      <h2>Demo app</h2>

      <div className="card">
        <ul className="specs">
          <li>
            <b>Is Supported: </b>
            <span>{isSupported ? "Yes" : "No"}</span>
          </li>
          <li>
            <b>Is Installed: </b>
            <span>{isInstalled ? "Yes" : "No"}</span>
          </li>
        </ul>
      </div>

      {isSupported && !isInstalled && (
        <div>
          <p className="read-the-docs">Click button below to install the app</p>
          <button onClick={handleOnInstall}>Install</button>
        </div>
      )}
    </>
  );
}

export default App;
