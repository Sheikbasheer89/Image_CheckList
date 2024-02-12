import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Components/SampleImageCheckList";
import AgGrid from "./Components/AgGrid";
import { useState } from "react";
import { Context } from "./Components/CommonFunction";
import SubDocumentFileResult from "./Components/SubDocumentFileResult";

function App() {
  const [contextDetails, setContextDetails] = useState({});
  let router = [
    { path: "/imagechecklistreact/index.html", Element: <Form /> },
    { path: "/imagechecklistreact/AgGrid", Element: <AgGrid /> },
    { path: "/imagechecklistreact/SubDocumentFileResult", Element: <SubDocumentFileResult /> },
  ];

  if (window.location.href.indexOf("localhost") > -1) {
    router.forEach(
      (item) => (item.path = item.path.replace("/imagechecklistreact", ""))
    );
  }

  return (
    <Context.Provider value={{ contextDetails, setContextDetails }}>
      <BrowserRouter>
        <Routes>
          {router.map((item, index) => (
            <Route path={item.path} key={index} element={item.Element} />
          ))}
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
