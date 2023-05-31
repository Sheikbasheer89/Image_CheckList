import React, { useState } from "react";
import "../Components/Modal.css";
import { handleAPI, TextBox, DropDown } from "./CommonFunction";
import CheckIcon from "@mui/icons-material/Check";

function Modal(props) {
  let {
    setOpenModal,
    fnSaveFieldsToDW,
    IsBorrExists,
    IsEntityExists,
    BorrLists,
    EntityLists,
    fnBorrEntityValueChange,
    WhichBorrower,
    WhichEnity,
    checkIcon,
    setcheckIcon,
    ShowError,
    ResJSON,
  } = props;

  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer">
        {/* <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title"></div> */}
        <div className="body">
          {Number(IsBorrExists) === 0 && (
            <span>
              <strong>
                {ResJSON["Which Borrower"]} is not recognized. Would you like to
                add this borrower, or map this to an existing borrower?
              </strong>
              <div>
                {/* <button
                  className="btn btn-primary"
                  style={{ minWidth: "205px" }}
                  onClick={() => {
                    setcheckIcon({
                      ...checkIcon,
                      Borrower: !checkIcon["Borrower"],
                    });

                    if (!checkIcon["Borrower"]) {
                      props.setWhichBorrower("0");
                    }
                  }}
                >
                  {checkIcon["Borrower"] && (
                    <CheckIcon fontSize="large"></CheckIcon>
                  )}{" "}
                  Create as New Borrower
                </button>{" "} 
                or{" "}*/}
                <DropDown
                  label="Borrower Name"
                  options={JSON.parse(BorrLists)}
                  value="CustId"
                  text="Name"
                  name="Name"
                  SelectedVal={WhichBorrower}
                  fromBorrEntityExists="1"
                  onChange={(e) => {
                    let { name, value } = e.target;
                    fnBorrEntityValueChange({
                      name: name,
                      value: value,
                      flag: 0,
                    });
                    if (value != 0)
                      setcheckIcon({
                        ...checkIcon,
                        Borrower: false,
                      });
                  }}
                  style={{ display: "inline-block", minWidth: "240px" }}
                  validationRequired={!checkIcon["Borrower"]}
                />
              </div>
            </span>
          )}
          {Number(IsEntityExists) === 0 && (
            <span>
              <strong>
                {ResJSON["Name of Employer"]} is not recognized. Would you like
                to add this employer, or map this to an existing employer?
              </strong>
              <div>
                {/* <button
                  className="btn btn-primary"
                  style={{ minWidth: "205px" }}
                  onClick={() => {
                    setcheckIcon({
                      ...checkIcon,
                      Entity: !checkIcon["Entity"],
                    });
                    if (!checkIcon["Entity"]) {
                      props.setWhichEnity("0");
                    }
                  }}
                >
                  {checkIcon["Entity"] && (
                    <CheckIcon fontSize="large"></CheckIcon>
                  )}{" "}
                  Create as New Entity
                </button>{" "}
                or{" "} */}
                <DropDown
                  label="Entity Name"
                  options={JSON.parse(EntityLists)}
                  value="Id"
                  text="Employer"
                  name="Employer"
                  SelectedVal={WhichEnity}
                  fromBorrEntityExists="2"
                  onChange={(e) => {
                    let { name, value } = e.target;
                    fnBorrEntityValueChange({
                      name: name,
                      value: value,
                      flag: 1,
                    });
                    if (value != 0)
                      setcheckIcon({
                        ...checkIcon,
                        Entity: false,
                      });
                  }}
                  style={{ display: "inline-block", minWidth: "240px" }}
                  validationRequired={!checkIcon["Entity"]}
                />
              </div>
            </span>
          )}
        </div>
        <div className="footer">
          {ShowError == "1" && (
            <span
              id="spnErrorStatus"
              style={{ fontSize: "16px", color: "red" }}
            >
              {" "}
              Please select an option
            </span>
          )}
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                fnSaveFieldsToDW();
              }}
              style={{ marginRight: "10px" }}
            >
              Proceed
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpenModal(false);
                props.setWhichBorrower(0);
                props.setWhichEnity(0);
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

export default Modal;
