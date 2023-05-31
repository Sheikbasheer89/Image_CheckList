import React, { useState, useContext, useEffect, Fragment } from "react";
import "./ImageCheckList.css";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";
import { Context } from "./CommonFunction";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function DropZone(props) {
  const {
    label,
    handleSetFile,
    fnGetLeaderLineSetup,
    setOriginalResJSON,
    LoanId,
    SessionId,
    setEnableSave,
    fndrawfield,
    setConditionalModalOpen,
    typeId,
    setConditionDetails,
    setScandocId,
    handleActivedropzone,
    activeDropzone,
    setConditionalRemainingModel,
  } = props;
  // console.log(props);
  const [ExtractProgres, setExtractProgres] = useState(false);
  const { contextDetails, setContextDetails } = useContext(Context);
  // console.clear();
  // console.log("=========================");
  // console.log(contextDetails);
  const fileUpload = (event) => {
    const [file] = event.target.files;
    const fileInfo = event.target.files[0];
    setExtractProgres(true);
    // fnGetLeaderLineSetup([]);
    setOriginalResJSON("");
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        // console.log(reader.result);
        handleSetFile(file);

        var formdata = new FormData();

        formdata.append("", fileInfo);

        let params = {
          LoanId: LoanId,
          DocTypeId: props.DocTypeId,
          sessionid: SessionId,
          category: props.Category,
          description: props.ShortName || "" + " for Loan " + LoanId,
          usedoc: 2,
          entityid: props.EntityId || 0,
          entitytypeid: props.EntityTypeId || 0,
          conditonid: props.ID,
        };

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        params = Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&");
        ////
        fetch(
          "https://www.solutioncenter.biz/LoginCredentialsAPI/api/UploadFiles?" +
            params,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            // console.log(result);
            // fnGetLeaderLineSetup(result);
            let getScandocId = result.split("~")[1];
            // console.log("ScandocId", getScandocId);
            setScandocId(getScandocId);
            result = result.split("~")[0];
            let ParsedJson = JSON.parse(result)["business_logic_json"];
            fnGetLeaderLineSetup(ParsedJson);
            setOriginalResJSON(result);
            setExtractProgres(false);
            setEnableSave(true);
            props.handleSetValuetoDD(
              JSON.parse(result)["doc_type"],
              props.DocTypeId
            );
            // fndrawfield();
          })
          .catch((error) => console.log("error", error));
      },
      false
    );
    if (file) {
      reader.readAsText(file);
      event.target.value = null;
    }
  };
  useEffect(() => {
    if (
      props.ID === activeDropzone.Id &&
      props.DocTypeId === activeDropzone.DocTypeId
    ) {
      setTimeout(() => {
        var myElement = document.querySelector(".activeDropZone");
        var topPos = myElement.offsetTop - 150;
        document.getElementById("divDropZoneWrapper").scrollTop = topPos;
      }, 100);
    }
  }, [props]);
  return (
    <>
      <div
        className={
          props.ID === activeDropzone.Id &&
          props.DocTypeId === activeDropzone.DocTypeId
            ? `activeDropZone`
            : ""
        }
        style={{
          borderBottom: "1px solid #999",
        }}
        onClick={() => {
          // return;
          handleActivedropzone({
            ...activeDropzone,
            ...{ Id: props.ID, DocTypeId: props.DocTypeId },
          });
        }}
      >
        <div
          style={{
            margin: "15px 15px 7px 15px",
            display: "inline-flex",
            width: "90%",
            cursor: "pointer",
          }}
        >
          {/* <div style={{ display: "inline-block", width: "30%" }}> */}
          <label
            className={`drop-container ${
              //props.Required === "1"  ? "btn-warning" :  ? 'btn-success' : "label-yellow"
              props.ScanDocId > 0
                ? "btn-success"
                : props.Required === "1"
                ? "btn-warning"
                : "label-yellow"
            }`}
          >
            <span className="drop-title">Click to Upload</span>
            <input
              type="file"
              name="file"
              id="uploadFile"
              accept=".pdf"
              onChange={fileUpload}
            ></input>
          </label>
          {/* </div> */}
          {/* <div style={{ display: "inline-block", width: "69%" }}> */}
          <span
            className="drop-content spndropzone"
            // onClick={(e) => {
            //
            //   e.target.style = "backgroundColor: yellow";
            // }}
          >
            {label || ""}

            {typeId !== "1" && (
              <Fragment>
                <Stack spacing={2} direction="row">
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setConditionalModalOpen(true);
                      setConditionDetails(props);
                    }}
                    style={{ cursor: "pointer" }}
                    className="btnRequirements"
                  >
                    Requirements
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setConditionalRemainingModel(true);
                    }}
                    style={{ cursor: "pointer" }}
                    className="btnCondRemaning"
                  >
                    Conditions Remaining
                  </Button>
                </Stack>
              </Fragment>
              // <span
              //   onClick={() => {
              //     setConditionalModalOpen(true);
              //     setConditionDetails(props);
              //   }}
              //   style={{ cursor: "pointer" }}
              // >
              //   <InfoIcon
              //     style={{ fontSize: 20, color: "#999", cursor: "pointer" }}
              //   ></InfoIcon>
              // </span>
            )}
          </span>
          {/* </div> */}
        </div>{" "}
        {ExtractProgres && (
          <div>
            <CircularProgress
              size={15}
              style={{ margin: "0px 5px 0px 15px" }}
            />
            <span style={{ verticalAlign: "top", fontSize: "12px" }}>
              {" "}
              Extracting Pdf...
            </span>
          </div>
        )}
        {/* {error.invalidFile !== undefined && (
          <div
            className="col-xs-3 col-sm-10 col-md-10 col-lg-10"
            style={{ margin: "15px" }}
          >
            <Alert severity="error">{error.invalidFile}</Alert>
          </div>
        )} */}
      </div>
    </>
  );
}

export default DropZone;
