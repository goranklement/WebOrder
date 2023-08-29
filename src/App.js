import "./App.css";
import Navbar from "./components/Navbar";
import Picker from "./components/Picker";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "primereact/resources/primereact.min.css";

import { PrimeReactProvider } from "primereact/api";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PrimeReactProvider>
          <Navbar />
          <Picker />
        </PrimeReactProvider>
      </header>
    </div>
  );
}

export default App;
