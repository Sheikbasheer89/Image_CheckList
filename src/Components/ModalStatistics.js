import React, { useState } from "react";
import "../Components/Modal.css";
import {
  handleAPI,
  TextBox,
  DropDown,
  TextBoxDatePicker,
} from "./CommonFunction";
import CheckIcon from "@mui/icons-material/Check";
import Statistics from "./Statistics";
import StatisticstblView from "./Statisticstblview";

function ModalStatistics(props) {
  let { setStatisticsmodalOpen } = props;
  const [dateFrom, setdateFrom] = useState(new Date());
  const [dateTo, setdateTo] = useState(new Date());
  const [isSearched, setisSearched] = useState(false);
  
  
  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer">
        {/* <label>Document Upload Statistics</label> */}
        <div className="body">
          <div style={{display:"flex"}}>
            <TextBoxDatePicker
              label="Date From"
              value={dateFrom}
             
              onChange={(date) => {
                debugger
                setdateFrom(date)
              }}
            ></TextBoxDatePicker>
            <TextBoxDatePicker
              label="Date To"
              value={dateTo}
              onChange={(date) => {
                debugger
                setdateTo(date)
              }}
            ></TextBoxDatePicker>
            <button
              className="btn btn-primary"
              style={{height: "40px", marginTop:"20px"}}
              onClick={() => {
                // setStatisticsmodalOpen(false);
                debugger;
                setisSearched(true);
              }}
              id="btnGo"
            >
              Go
            </button>
            
          </div>
          <div><StatisticstblView idataFrom={dateFrom} idataTo={dateTo} isSearched={isSearched} setisSearched={setisSearched}></StatisticstblView></div>
        </div>
        <div className="footer">
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStatisticsmodalOpen(false);
              }}
              id="btncancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalStatistics;
