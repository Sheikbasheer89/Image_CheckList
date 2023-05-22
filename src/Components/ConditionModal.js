import React, { Component } from "react";
import CircleIcon from "@mui/icons-material/Circle";

function ConditionalModal(props) {
  //   debugger;
  let { setConditionalModalOpen, conditionalModalOpen, conditionDetails } =
    props;

  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer">
        <span style={{ fontSize: "16px", marginBottom: "10px" }}>
          <b>{conditionDetails.DocType}</b>
        </span>
        <span class="white">
          <CircleIcon color="error" /> Upload document that meets the following
          requirements:
        </span>
        <div className="body" style={{ paddingRight: "4px" }}>
          <span
            style={{ fontSize: "15px" }}
            dangerouslySetInnerHTML={{ __html: conditionDetails.LongDesc }}
          ></span>
        </div>
        <div className="footer">
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setConditionalModalOpen(false);
              }}
              id="btnClose"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConditionalModal;
