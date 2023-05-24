import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Components/SampleImageCheckList";
import AgGrid from "./Components/AgGrid";
import { useState } from "react";
import { Context } from "./Components/CommonFunction";

function App() {
  const [contextDetails, setContextDetails] = useState({});
  return (
    <Context.Provider value={{ contextDetails, setContextDetails }}>
      <BrowserRouter>
        <Routes>
          <Route path="/index.html" element={<Form />} />
          <Route path="/AgGrid" element={<AgGrid />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
