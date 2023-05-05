// Import bootstrap, some routing tools, the App and the other JSX Files
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginForm from './components/LoginForm';
import Summits from "./components/Summits";
import UpdateSummits from "./components/UpdateSummits";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/home" element={<Summits/>}/>
        <Route path="/update/:id" element={<UpdateSummits/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
