import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Document, Page, pdfjs } from "react-pdf";
import samplepdf from "../../src/SamplePdf.pdf";
import "bootstrap/dist/css/bootstrap.css";
import "../Components/ImageCheckList.css";
import "../Components/BoostrapOld.css";
import DropZone from "./DropZone";
import { paste } from "@testing-library/user-event/dist/paste";
import { XMLParser } from "react-xml-parser";
import { DirectionsBusFilled, Filter } from "@mui/icons-material";
import { handleAPI, TextBox, DropDown } from "./CommonFunction";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formColumn: {
    margin: "0 1rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid black",
    marginTop: "15px",
    height: "500px",
  },
}));

function Form() {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [file, setFile] = useState("");
  const [ResJSON, setResJSON] = useState([]);
  const [LoanId, setLoanId] = useState("");
  const [DocType, setDocType] = useState("");
  const [Details, setDetails] = useState({ DocType: 0 });
  const [DocDetails, setDocDetails] = useState([]);
  const url = "https://www.africau.edu/images/default/sample.pdf";
  const [pageNumber, setPageNumber] = useState(1);
  const [OriginalResJSON, setOriginalResJSON] = useState("");
  const [DocTypeValue, setDocTypeValue] = useState("0");
  const [SessionId, setSessionId] = useState("");
  const [EnableSave, setEnableSave] = useState(false);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const canvas = useRef();
  // let ctx = null;

  // initialize the canvas context
  // useEffect(() => {
  //   // dynamically assign the width and height to canvas
  //   const canvasEle = canvas.current;
  //   canvasEle.width = canvasEle.clientWidth;
  //   canvasEle.height = canvasEle.clientHeight;

  //   // get context of the canvas
  //   ctx = canvasEle.getContext("2d");
  // }, []);

  function fndrawfield() {
    drawLine(
      { x: 101.2, y: 718.5150000000001, x1: 0, y1: 20 },
      { color: "red" }
    );
  }

  // draw a line
  const drawLine = (info, style = {}) => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;

    // get context of the canvas
    let ctx = canvasEle.getContext("2d");
    const { x, y, x1, y1 } = info;
    const { color = "black", width = 1 } = style;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  const fnValueChange = (e) => {
    let { name, value } = e.target;
    setDetails({ ...Details, [name]: value });
    setEnableSave(true);
  };

  const fntxtChange = (e) => {
    //debugger;
    let { name, value } = e.target;
    setResJSON({ ...ResJSON, [name]: value });
    setEnableSave(true);
  };

  const handleSetFile = (file) => {
    setFile(file);
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  useEffect(() => {
    console.log("LoanIddd", LoanId);
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    setLoanId(searchParams.get("LoanId"));
    setSessionId(searchParams.get("SessionId"));

    handleAPI({
      name: "GetUWStatusChecklistData",
      params: {
        LoanId: searchParams.get("LoanId"),
        formparam: "",
        TypeId: 1,
        UserType: "E",
        Id: 1,
        EmpNum: 27013,
      },
    })
      .then((response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        //debugger;
        setDocDetails(JSON.parse(response["Table"][0].Column1)[0] || []);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });

    handleAPI({
      name: "GetDocumentType",
      params: { LoanId: searchParams.get("LoanId") },
    })
      .then((response) => {
        console.log(response);
        response = JSON.parse(response);
        setDocType(response);
        console.log(response);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }, [LoanId]);
  const handleSetValuetoDD = (docType) => {
    if (docType !== undefined && DocType !== "") {
      let Filterdoctype = DocType.filter((items) => {
        return (
          items.DocType.replaceAll(" ", "").toLowerCase() ===
          docType.toLowerCase()
        );
      });
      if (Filterdoctype.length > 0) {
        setDocTypeValue(Filterdoctype[0].Id);
      }
    }
  };

  // useEffect(() => {
  //   if (ResJSON.length > 0 && DocType !== "") {
  //     debugger;
  //     let docType = ResJSON["doc_type"];
  //     let Filterdoctype = DocType.filter((items) => {
  //       return (
  //         items.DocType.replaceAll(" ", "").toLowerCase() ===
  //         docType.toLowerCase()
  //       );
  //     });
  //     if (Filterdoctype.length > 0) {
  //       setDocTypeValue(Filterdoctype[0].Id);
  //       console.log("===> ", Filterdoctype[0].Id);
  //     }
  //   }
  // }, [ResJSON]);
  function fnSaveFieldsToDW() {
    let docType = DocType.filter(
        (items) =>
          parseInt(items.Id) === parseInt(Details["DocType"] || DocTypeValue)
      ),
      originalData = {
        task_id: JSON.parse(OriginalResJSON)["task_id"],
        doc_type: docType[0].DocType,
        ...ResJSON,
      };
    let FilterJSON = {};
    FilterJSON = JSON.stringify(originalData);

    handleAPI({
      name: "UpdateResponseInDW",
      params: {
        LoanId: LoanId,
        FilterJSON: FilterJSON,
      },
    })
      .then((response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }

  function fnSendFeedbacktoAPI() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3");
    myHeaders.append("Content-Type", "application/json");
    let docType = DocType.filter(
        (items) =>
          parseInt(items.Id) === parseInt(Details["DocType"] || DocTypeValue)
      ),
      originalData = {
        task_id: JSON.parse(OriginalResJSON)["task_id"],
        doc_type: docType[0].DocType,
        ...ResJSON,
      };
    // console.log("=====>", originalData);
    // return;
    let raw = {}; //JSON.stringify({
    //   task_id: "2023-04-26-07-37-42-dbe77e0b-0fe2-4a19-9317-12d23ba35d90",
    //   doc_type: "Paystub",
    //   "Name of Employer": "University of Utah",
    //   "Which Borrower": "RICARDO FEO CARDOSO",
    //   "Paid From Date": "12/01/2021",
    //   "Paid To Date": "12/15/2021",
    //   "Pay Frequency": "Biweekly",
    //   "Gross Pay": "$8,369.29",
    //   "YTD Earnings": "$131,789.84",
    //   "Hours Worked Per Week": "Unknown",
    // });
    raw = JSON.stringify(originalData);
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      crossDomain: true,
    };

    fetch(
      "https://www.solutioncenter.biz/LoginCredentialsAPI/api/SendFeedbacktoAPI",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        handleFooterMsg(JSON.parse(result)["message"]);
      })
      .catch((error) => console.log("error", error));
  }
  const handleFooterMsg = (msg) => {
    document.getElementById("spnSaveStatus").innerHTML = msg;

    document.getElementById("divsuccess").style.display = "";
    setTimeout(() => {
      document.getElementById("divsuccess").style.display = "none";
    }, 4000);
  };
  //DOM Section
  return (
    <>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 headergradient">
        <div
          className="col-xs-8 col-sm-8 col-md-8 col-lg-8 align-left"
          style={{ paddingTop: "5px", paddingLeft: "15px" }}
        >
          <span
            style={{ fontSize: "large", fontWeight: "bold", color: "white" }}
          >
            Image Checklist
          </span>
          <span
            style={{ fontSize: "large", fontWeight: "bold", color: "white" }}
            id="spnLoanid"
          >
            {" "}
            - {LoanId}
          </span>
          <button
            className="btn btn-primary"
            //onClick="RefreshPage(); return false;"
            style={{
              marginBottom: "2px",
              marginLeft: "5px",
              color: "#368cde",
              backgroundColor: "white",
              fontSize: "15px",
            }}
          >
            Refresh
          </button>
        </div>
        <div
          className="align-right"
          id="div15"
          style={{ marginTop: "5px" }}
        ></div>
      </div>

      <div
        className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
        style={{ marginTop: "10px" }}
      >
        <div
          className="col-xs-12 col-sm-12 col-md-3 col-lg-3 ContainerBorder"
          style={{ padding: " 10px 4px" }}
        >
          {
            /* Form fields for column 1 */
            <div>
              <Tabs>
                <TabList>
                  <Tab>Documents Needed</Tab>
                  <Tab>Documents Uploaded</Tab>
                </TabList>
                <TabPanel>
                  <DropZone
                    typeId="1"
                    label="Upload any document and we'll recognize it for you."
                    handleSetFile={handleSetFile}
                    setResJSON={setResJSON}
                    setOriginalResJSON={setOriginalResJSON}
                    LoanId={LoanId || 0}
                    SessionId={SessionId || ""}
                    {...{
                      DocTypeId: "269",
                      Category: "3",
                      LongDesc: "Miscellaneous",
                      ID: "-99",
                      EntityId: "0",
                      EntityTypeId: "1",
                    }}
                    setEnableSave={setEnableSave}
                    handleSetValuetoDD={handleSetValuetoDD}
                    fndrawfield={fndrawfield}
                  />
                  <div style={{ maxHeight: "68vh", overflowY: "auto" }}>
                    {DocDetails.filter(
                      (
                        (s) => (o) =>
                          ((k) => !s.has(k) && s.add(k))(
                            ["ID", "DocTypeId"].map((k) => o[k]).join("|")
                          )
                      )(new Set())
                    ).map((item, index) => {
                      return (
                        <DropZone
                          typeId={item["DocTypeId"]}
                          label={item["ShortName"]}
                          handleSetFile={handleSetFile}
                          setResJSON={setResJSON}
                          {...item}
                          key={index}
                          setOriginalResJSON={setOriginalResJSON}
                          LoanId={LoanId || 0}
                          SessionId={SessionId || ""}
                          handleSetValuetoDD={handleSetValuetoDD}
                          setEnableSave={setEnableSave}
                          fndrawfield={fndrawfield}
                        />
                      );
                    })}
                  </div>
                </TabPanel>
                <TabPanel>
                  <h2>Tab 2 Content</h2>
                  <p>This is the content for Tab 2</p>
                </TabPanel>
                <TabPanel>
                  <h2>Tab 3 Content</h2>
                  <p>This is the content for Tab 3</p>
                </TabPanel>
              </Tabs>
            </div>
          }
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 ContainerBorder">
          {
            /* Form fields for column 2 */
            <>
              <h2>Image Column</h2>
              <div>
                <canvas
                  ref={canvas}
                  style={{
                    position: "absolute",
                    zIndex: 999,
                    width: 612,
                    height: 792,
                  }}
                ></canvas>

                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  height="100%"
                  width="100%"
                >
                  <Page pageNumber={pageNumber} size="A4" />
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                </Document>
              </div>
            </>
          }
        </div>
        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 ContainerBorder">
          {
            /* Form fields for column 3 */
            <div>
              <Tabs>
                <TabList>
                  <Tab>Fields</Tab>
                  <Tab>JSON</Tab>
                </TabList>
                <TabPanel>
                  {Object.keys(ResJSON).length > 0 ? (
                    <>
                      <DropDown
                        label="Document Type"
                        options={DocType}
                        value="Id"
                        text="DocType"
                        name="DocType"
                        SelectedVal={DocTypeValue}
                        fnValueChange={fnValueChange}
                      />
                      <TextBox
                        name="Name of Employer"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Employer Name"
                      />
                      <TextBox
                        name="Which Borrower"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Which Borrower"
                      />
                      <TextBox
                        name="Paid From Date"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Paid From Date"
                      />
                      <TextBox
                        name="Paid To Date"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Paid To Date"
                      />
                      <TextBox
                        name="Pay Frequency"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Pay frequency"
                      />
                      <TextBox
                        name="Gross Pay"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Gross Pay"
                      />
                      <TextBox
                        name="YTD Earnings"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. YTD Earnings on paystub"
                      />
                      <TextBox
                        name="Hours Worked Per Week"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Hours Worked Per Week"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </TabPanel>
                <TabPanel>
                  {Object.keys(ResJSON).length > 0 ? (
                    <div>
                      <pre>{OriginalResJSON}</pre>
                    </div>
                  ) : (
                    <></>
                  )}
                </TabPanel>
              </Tabs>
            </div>
          }
        </div>
      </div>
      <div
        className="navbar navbar-default navbar-fixed-bottom"
        style={{ display: "unset" }}
      >
        <div
          id="reasonInfo"
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-center"
          style={{ margin: "10px", display: "none" }}
        >
          <span className="alert alert-info align-center">
            <span id="Span6" style={{ fontSize: "10px" }}></span>
          </span>
        </div>
        <div>
          <div
            className="pull-left col-xs-4 col-sm-4 col-md-4 col-lg-4"
            id="divRunValidation"
            style={{ paddingTop: "5px", paddingLeft: "6px" }}
          >
            <div className="btn-group dropup align-left">
              <div id="btnMenu" className="btn-group">
                <button
                  type="button"
                  data-toggle="dropdown"
                  className="btn btn-primary btndd"
                  style={{
                    backgroundColor: "#428bca!important",
                    border: "0px",
                  }}
                >
                  Menu
                </button>
                <ul className="dropdown-menu" id="ULThumb" width="100%">
                  <li
                    className="idauthmenu"
                    //onClick="openIdAuth();return false;"
                    style={{ cursor: "pointer", display: "none" }}
                  >
                    <a id="A9">Identity Authentication For Signers</a>
                  </li>
                  <li
                    className="divider idauthmenu"
                    style={{ display: "none" }}
                  />
                  <li
                    className="clsRunValidation"
                    id="li1"
                    //onClick
                    style={{ cursor: "pointer", display: "none" }}
                  >
                    <a id="A2">View all</a>
                  </li>
                  <li
                    id="li4"
                    //onClick="Get_Update_LastView1(1);getSetDataMoveObj(false);return false;"
                    style={{ cursor: "pointer" }}
                  >
                    <a id="A4">Save Form Size and Position</a>
                  </li>
                  <li className="divider" />
                  <li>
                    <a href="#" style={{ cursor: "default" }}>
                      Copy text with proper sentence case &nbsp;
                      <input
                        type="checkbox"
                        id="sentenceCaseCheck"
                        className="ace ace-switch ace-switch-2 caseCheck"
                        allowblank="Y"
                        validationtype={1}
                        onChange={() => {}}
                      />
                      <span className="lbl" />
                    </a>
                  </li>
                  <li className="divider" />
                  <li>
                    <a href="#" style={{ cursor: "default" }}>
                      Copy text with title case &nbsp;
                      <input
                        type="checkbox"
                        id="tileCaseCheck"
                        className="ace ace-switch ace-switch-2 caseCheck"
                        allowblank="Y"
                        validationtype={1}
                        onChange={() => {}}
                      />
                      <span className="lbl" />
                    </a>
                  </li>
                  <li className="divider" />
                  <li
                    //onClick="openCondAssociation();"
                    style={{ cursor: "pointer" }}
                  >
                    <a href="#">Condition Association</a>
                  </li>
                  <li className="divider" />
                  <li style={{ cursor: "pointer" }}>
                    <a href="#">Update Conditions</a>
                  </li>
                  <li className="divider" />
                  <li
                    className="clsEditRights"
                    style={{ cursor: "pointer", textAlign: "center" }}
                  >
                    <span className="lnkEditRights">
                      <button
                        className="btn-smnotallow"
                        tabIndex={-1}
                        //onClick="showRights();return false;"
                      >
                        Edit Rights: Not Allowed
                      </button>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="field-set on-focus" style={{ display: "none" }}>
            <select
              name="ddlcurrentview"
              id="ddlcurrentview"
              placeholder="Current View"
              allowblank="Y"
              validationtype={2}
              onChange={() => {}}
              style={{
                width: "230px",
                display: "inline-grid",
                paddingTop: "0px",
                paddingBottom: "2px",
                marginBottom: "15px",
                height: "21px",
                color: "rgb(141, 141, 141)",
              }}
            ></select>
            <label htmlFor="ddlcurrentview">Current View</label>
          </div>
          <div className="col-xs-4 col-sm-4 col-md-5 col-lg-5 align-center">
            <button
              type="button"
              id="btnsave"
              className={`btn ${EnableSave ? "btn-primary" : "btnDisable"}`}
              disabled={!EnableSave}
              onClick={() => {
                fnSaveFieldsToDW();
                fnSendFeedbacktoAPI();
                handleFooterMsg("Saved Successfully.");
              }}
            >
              Save
            </button>
            {"   "}
            <button
              type="button"
              id="btnCancel"
              className="btn btn-primary"
              onClick={() => window.close()}
              //onClick="Cancel_Overal();return false;"
            >
              Close
            </button>
          </div>

          <span
            id="divsuccess"
            className="alert alert-success
                align-center"
            style={{ display: "none" }}
          >
            <span id="spnSaveStatus" style={{ fontSize: "10px" }}>
              Data Saved Successfully
            </span>{" "}
          </span>
          <span
            id="divError"
            className="alert alert-danger
                align-center"
            style={{ display: "none" }}
          >
            <span id="Span5" style={{ fontSize: "10px" }}>
              Error occured during save!
            </span>{" "}
          </span>
          <span id="updatingconditons" style={{ display: "none" }}>
            <i className="glyphicon glyphicon-refresh bigger-150 fa-spin blue" />
            Updating Loan Conditions…
          </span>
        </div>
      </div>
    </>
  );
}

export default Form;
