import * as React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CircleIcon from "@mui/icons-material/Circle";
// import Box from "@mui/material/Box";
// import Tab from "@mui/material/Tab";
// import TabContext from "@material-ui/lab/TabContext";
// import TabList from "@material-ui/lab/TabList";
// import TabPanel from "@material-ui/lab/TabPanel";
// import "../Components/Modal.css";
import CircularProgress from "@mui/material/CircularProgress";

import { handleAPI } from "./CommonFunction";

export default function ConditionalRemainingCompleteModel(props) {
  const {
    setConditionalRemainingModel,
    CondRemaining,
    ValidationMsg,
    uploadedDocDetails,
    CondCompleted,
    conditionDetails,
  } = props;
  //console.log(uploadedDocDetails.PassedValidation);
  debugger;

  const LongDesc = conditionDetails.LongDesc?.toString().replace(
    /&amp;apos;/g,
    "'"
  );
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer" style={{ width: "55%" }}>
        <span style={{ fontSize: "16px", marginBottom: "10px" }}>
          <b></b>
        </span>

        <div className="body" style={{ paddingRight: "4px" }}>
          <Tabs>
            {/* <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}> */}
            {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab>Conditions Remaining</Tab>
              <Tab>Conditions Completed</Tab>
              <Tab>Underwriting Requirements</Tab>
            </TabList>
            {/* </Box> */}
            <TabPanel value="1" style={{ marginTop: "5px", padding: "0px" }}>
              <>
                {CondRemaining.length > 0 &&
                (uploadedDocDetails.PassedValidation === 0 ||
                  uploadedDocDetails.PassedValidation === undefined) ? (
                  <>
                    {" "}
                    {CondRemaining.map((item, index) => {
                      return (
                        <div
                          className="panel-group"
                          style={{
                            backgroundColor: " #ffffff",
                            marginBottom: "0px",
                          }}
                        >
                          <div>
                            <div className="panel panel-default">
                              <div className="panel-heading ">
                                <div className="row">
                                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                                    <span style={{ fontSize: "12px" }}>
                                      <b>{index + 1} . </b>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: item.ReferReason,
                                        }}
                                      ></span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : CondRemaining.length == 0 && ValidationMsg !== "" ? (
                  ValidationMsg
                ) : uploadedDocDetails.PassedValidation === 1 ? (
                  "This Document Passes Validation"
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress
                      size={25}
                      style={{ margin: "0px 5px 0px 15px" }}
                    />
                    <span
                      style={{
                        verticalAlign: "initial",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      Please wait...
                    </span>
                  </div>
                )}
              </>
            </TabPanel>
            <TabPanel value="2">
              {uploadedDocDetails.PassedValidation === 1 &&
              props.conditionDetails.typeId === 169 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: `1. <b>30 day period.</b> Paystubs are required to include / cover a minimum of 30 days. <br>
                    2. <b>W-2;</b> a W-2 needs to be uploaded done.<br>
                    3. The Paystub Gross Pay data has been validated.<br>
                    4. The Paystub Pay Frequency data has been validated.<br>
                    5. The Year data has been validated.<br>
                    6. The Name of Employer data has been validated.<br>
                    7. The Paystub YTD Earnings data has been validated.<br>
                    8. The Paystub Paid From Date data has been validated.<br>
                    9. The Paystub Paid To Date data has been validated.<br>
                  10. The Hours Worked Per Week data has been validated.`,
                  }}
                ></span>
              ) : CondCompleted.length > 0 ? (
                CondCompleted.map((Completed, index) => {
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          index + 1 + ". " + Completed.CompletedReason + "<br>",
                      }}
                    ></span>
                  );
                })
              ) : (
                ""
              )}
            </TabPanel>
            <TabPanel value="3">
              <span style={{ fontSize: "16px", marginBottom: "10px" }}>
                <b>{conditionDetails.DocType}</b>
              </span>
              <span className="white">
                <CircleIcon color="error" /> Upload document that meets the
                following requirements:
              </span>
              <div
                className="body"
                style={{ paddingRight: "4px", overflow: "hidden" }}
              >
                <span
                  style={{ fontSize: "15px" }}
                  dangerouslySetInnerHTML={{
                    __html: LongDesc,
                  }}
                ></span>
              </div>
              <div class="pagebottom">
                <span class="footertext">Page Bottom</span>
              </div>
            </TabPanel>
            {/* </TabContext>
          </Box> */}
          </Tabs>
        </div>
        <div className="footer">
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setConditionalRemainingModel(false);
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
