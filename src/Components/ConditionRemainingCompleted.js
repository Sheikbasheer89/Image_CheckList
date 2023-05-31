import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
// import "../Components/Modal.css";
import CircularProgress from "@mui/material/CircularProgress";

import { handleAPI } from "./CommonFunction";

// export default function ConditionalRemainingCompleteModel(props, ref) {
const ConditionalRemainingCompleteModel = React.forwardRef((props, ref) => {
  alert();
  const {
    setConditionalRemainingModel,
    scandocId,
    userId,
    setIsLoadedSuccess,
  } = props;
  const [value, setValue] = React.useState("1");

  const [CondRemaining, setCondRemaining] = React.useState([]);
  const [ValidationMsg, setValidationMsg] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // React.useImperativeHandle(ref, () => {
  //   // alert();
  //   fnRunImageValidation();
  // });
  React.useEffect(() => {
    //   console.log("fsdfhgsdagfsdag");
    function fnRunImageValidation() {
      handleAPI({
        name: "RunImageValidation",
        params: { scandocid: scandocId, UserID: userId },
      })
        .then((response) => {
          console.log(response);
          let dataarray = response.split("~~~~");
          let validationmsg = "";
          if (dataarray[0] == "1") {
            validationmsg = "This Document Passes Validation";

            setValidationMsg(validationmsg);
          } else if (dataarray[0] == "-1") {
            validationmsg = "Document Refer Reasons";
            setValidationMsg(validationmsg);
            let ResultJSON = JSON.parse(dataarray[1]).ValidationMessages;
            debugger;
            setCondRemaining(ResultJSON);
          } else if (dataarray[0] == "-98") {
            validationmsg =
              "Image Data is not availabe for Validation, please update and run again.";

            setValidationMsg(validationmsg);
          } else if (dataarray[0] == "-90") {
            validationmsg =
              "Image Validation Failed. Please try again or contact support.";

            setValidationMsg(validationmsg);
          } else {
            validationmsg =
              "There Are No Validation Rules For This Document Type.";

            setValidationMsg(validationmsg);
          }
        })
        .catch((error) => {
          //debugger;
          console.log("error", error);
        });
    }
    fnRunImageValidation();
  }, []);

  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer">
        <span style={{ fontSize: "16px", marginBottom: "10px" }}>
          <b></b>
        </span>

        <div className="body" style={{ paddingRight: "4px" }}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Conditions Remaining" value="1" />
                  <Tab label="Conditions Completed" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <>
                  {CondRemaining.length > 0 ? (
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
              <TabPanel value="2">Under Progress</TabPanel>
            </TabContext>
          </Box>
        </div>
        <div className="footer">
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setConditionalRemainingModel(false);
                setIsLoadedSuccess(false);
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
});
export default ConditionalRemainingCompleteModel;
