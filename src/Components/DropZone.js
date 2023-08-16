import React, {
  useState,
  useContext,
  useEffect,
  Fragment,
  useCallback,
} from "react";
import "./ImageCheckList.css";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";
import { Context } from "./CommonFunction";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { handleAPI } from "./CommonFunction";
import { useDropzone } from "react-dropzone";
import DoneIcon from "@mui/icons-material/Done";

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
    fnCheckConditionalRemainingModel,
    setExtractResult,
    setWhichProcessMsg,
    setOpenMsg,
    setDocCheck,
    setDocTypeValue,
    setDocDbFields,
    setFieldExtractProgres,
    setTaskId,
    setActiveDropzone,
    IncomeCalcProgres,
    fnCheckBorrEntityExistsValidation,
    setFeedBackCollection,
    setMultipleProgressbar,
    MultipleProgressbar = [],
  } = props;
  // console.log("Props", props);
  const [ExtractProgres, setExtractProgres] = useState(false);
  const { contextDetails, setContextDetails } = useContext(Context);

  // console.clear();
  // console.log("=========================");
  // console.log(contextDetails);

  // const onDrop = useCallback((acceptedFiles) => {
  //   acceptedFiles.forEach((file) => {
  //     // let event = { target: file };
  //     fileUpload(file);
  //     // const reader = new FileReader();

  //     // reader.onabort = () => console.log("file reading was aborted");

  //     // reader.onerror = () => console.log("file reading has failed");

  //     // reader.onload = () => {
  //     //   const binaryStr = reader.result;

  //     //   console.log("File Name ===> ", file.name);

  //     //   console.log("Data ===> ", binaryStr);
  //     // };

  //     // reader.readAsArrayBuffer(file);
  //   });
  // }, []);

  // const { getRootProps, getInputProps } = useDropzone({ onDrop });
  // useEffect(() => {
  //   window.dispatchEvent(new Event('resize'));
  // }, [MultipleProgressbar])

  const fileUpload = async (event) => {
    let file;
    let fileInfo;
    const selectedFiles = event.target.files;
    debugger;
    // setExtractProgres(true);
    setFieldExtractProgres(true);
    setDocTypeValue(0);
    // setDocDbFields([]);
    fnGetLeaderLineSetup({});
    setOriginalResJSON("");
    setMultipleProgressbar([...[], ...Array.from(selectedFiles)]);
    for (let i = 0; i < selectedFiles.length; i++) {
      file = selectedFiles[i];
      fileInfo = selectedFiles[i];
      console.log(`Uploading file ${i + 1}: ${file.name}`);

      // const reader = new FileReader();

      // reader.addEventListener(
      //   "load",
      //   () => {
      // console.log(reader.result);
      handleSetFile(file);
      setFeedBackCollection(true);
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
      await fetch(
        "https://www.solutioncenter.biz/LoginCredentialsAPI/api/UploadFiles?" +
          params,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          // fnGetLeaderLineSetup(result);
          console.log(selectedFiles);
          let selectedFiles_ = Array.from(selectedFiles),
            fileType =
              JSON.parse(result.split("~")[0]).doc_type || "Miscellaneous";

          selectedFiles_[i].isComplete = true;
          selectedFiles_[
            i
          ].docMovedMessage = `This document is recognized as ${fileType} and was moved to ${fileType} section.`;
          selectedFiles_[i].docType = JSON.parse(result.split("~")[0])[
            "doc_type"
          ];
          selectedFiles_[i].docTypeId = props.DocTypeId;
          selectedFiles_[i].ScandocId = result.split("~")[1];
          selectedFiles_[i].confidence_score =
            JSON.parse(result.split("~")[0]).doc_type_confidence_score || "";

          let IsSaved = 1;
          if (result.split("~")[2] !== undefined)
            IsSaved = result.split("~")[2];
          selectedFiles_[i].IsSaved = IsSaved;

          selectedFiles_[i].ParsedJson = "";

          console.log(MultipleProgressbar);
          setMultipleProgressbar([...[], ...selectedFiles_]);
          let getScandocId = result.split("~")[1];
          if (
            getScandocId === undefined ||
            // result?.toString().indexOf("business_logic_json") === -1
            result?.toString().indexOf("extraction_json") === -1 ||
            JSON.parse(result.split("~")[0]).extraction_json === null
          ) {
            // setExtractProgres(false);
            setFieldExtractProgres(false);
            setExtractResult(result);
            setOriginalResJSON("");
            setScandocId(getScandocId);
            // fnPdfclassification(file, getScandocId, requestOptions);
            setWhichProcessMsg(0);
            // setDocCheck(
            //   JSON.parse(result.split("~")[0]).doc_type || "Miscellaneous"
            // );
            // setOpenMsg(true);
            setTaskId(JSON.parse(result.split("~")[0]).task_id);

            // let Confident_Score = JSON.parse(
            //   result.split("~")[0]
            // ).doc_type_confidence_score;
            // props.handleSetValuetoDD(
            //   JSON.parse(result.split("~")[0])["doc_type"],
            //   props.DocTypeId,
            //   getScandocId,
            //   Confident_Score || ""
            // );

            fnGetLeaderLineSetup({});
            setOriginalResJSON(result.split("~")[0]);

            return;
          }
          // console.log("ScandocId", getScandocId);
          setExtractResult("");
          setScandocId(getScandocId);
          // let IsSaved = 1;
          // if (result.split("~")[2] !== undefined)
          //   // IsSaved = result.split("~")[2];

          result = result.split("~")[0];
          // let ParsedJson = JSON.parse(result)["business_logic_json"];
          let ParsedJson = JSON.parse(result)["extraction_json"];
          console.log(ParsedJson);
          fnGetLeaderLineSetup(ParsedJson);
          setOriginalResJSON(result);
          selectedFiles_[i].ParsedJson = ParsedJson;
          // props.handleSetValuetoDD(
          //   JSON.parse(result)["doc_type"],
          //   props.DocTypeId,
          //   getScandocId
          // );
          // setExtractProgres(false);
          setFieldExtractProgres(false);

          // if (Number(IsSaved) !== 1) {
          //   setEnableSave(true);
          //   if (JSON.parse(result)["doc_type"].toLowerCase() === "paystub")
          //     setTimeout(() => {
          //       fnCheckBorrEntityExistsValidation(1, ParsedJson);
          //     }, 10);
          // } else setEnableSave(false);

          // fndrawfield();
        })
        .catch((error) => console.log("error", error));
      // }
      //   ,
      //   false
      // );
    }
    if (event.target.files) {
      event.target.value = null;
    }
  };

  function fnPdfclassification(file, iScandocId, irequestOptions) {
    let params = {
      ScanDocId: iScandocId,
      LoanId: LoanId,
      ViewType: 0,
    };

    params = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    fetch(
      "https://www.solutioncenter.biz/LoginCredentialsAPI/api/finddocClassification?" +
        params,
      irequestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setWhichProcessMsg(0);
        setDocCheck(JSON.parse(response).doc_type);
        setOpenMsg(true);
        setTaskId(JSON.parse(response).task_id);
        props.handleSetValuetoDD(
          JSON.parse(response)["doc_type"],
          props.DocTypeId
        );
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    // Process the dropped files here
    console.log(files);
  };

  useEffect(() => {
    if (
      props.ID === activeDropzone.Id &&
      props.DocTypeId === activeDropzone.DocTypeId &&
      activeDropzone.PreventScroll
    ) {
      setActiveDropzone({ ...activeDropzone, PreventScroll: false });
      setTimeout(() => {
        try {
          var myElement = document.querySelector(".activeDropZone");
          var topPos = myElement.offsetTop - 300;
          document.getElementById("divDropZoneWrapper").scrollTop = topPos;
        } catch (error) {}
      }, 100);
    }
  }, [props]);
  return (
    <>
      <div
        className={
          props.ID === activeDropzone.Id &&
          props.DocTypeId === activeDropzone.DocTypeId
            ? `activeDropZone divMaindropZone`
            : "divMaindropZone"
        }
        style={{
          borderBottom: "1px solid #999",
        }}
        onClick={(event) => {
          // return;
          // debugger;
          if (
            event.target.classList.toString().indexOf("btnCondRemaning") !== -1
          ) {
            let button = document.querySelector(".btnCondRemaning");

            // if (button) {
            //   let parentDiv = button.closest(".divMaindropZone");
            //   if (
            //     parentDiv.classList.toString().indexOf("activeDropZone") === -1
            //   ) {
            //     handleActivedropzone({
            //       ...activeDropzone,
            //       ...{ Id: props.ID, DocTypeId: props.DocTypeId },
            //     });
            //   }
            // }
          }

          if (
            event.target.classList.toString().indexOf("btnRequirements") ===
              -1 &&
            event.target.classList.toString().indexOf("btnCondRemaning") ===
              -1 &&
            event.target.classList.toString().indexOf("drop-container") ===
              -1 &&
            event.target.classList.toString().indexOf("drop-title") === -1 &&
            event.target.classList.toString().indexOf("ahrefcls") === -1
          )
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
            position: "relative",
          }}
          // {...getRootProps()}
        >
          {/* <div style={{ display: "inline-block", width: "30%" }}> */}
          {/* <label
            className={`drop-container ${
              //props.Required === "1"  ? "btn-warning" :  ? 'btn-success' : "label-yellow"
              props.ScanDocId > 0
                ? "btn-success"
                : props.Required === "1"
                ? "btn-warning"
                : "label-yellow"
            }`}
          > */}
          {/* <span className="drop-title">Click to Upload</span> */}
          <div style={{ width: "40%" }}>
            {/* <label htmlFor="uploadFile" className="drop-title">
            Click to Upload
          </label> */}
            <div
              className="drop-title"
              onDragOver={(e) => {
                e.currentTarget.style.zIndex = 0;
              }}
              onClick={(e) => {
                e.currentTarget.nextSibling.click();
              }}
            >
              Click to Upload
            </div>

            <input
              className={`drop-container ${
                //props.Required === "1"  ? "btn-warning" :  ? 'btn-success' : "label-yellow"
                props.ScanDocId > 0
                  ? "btn-success"
                  : props.Required === "1"
                  ? "btn-warning"
                  : "label-yellow"
              }`}
              type="file"
              name="file"
              id="uploadFile"
              accept=".pdf"
              onChange={(e) => {
                e.currentTarget.previousSibling.style.zIndex = 11;
                fileUpload(e);
              }}
              multiple
            ></input>
          </div>
          {/* <input style={{ display: "none" }} {...getInputProps} /> */}
          {/* </label> */}
          {/* </div> */}
          {/* <div style={{ display: "inline-block", width: "69%" }}> */}
          <span
            className="drop-content spndropzone"
            // onClick={(e) => {
            //
            //   e.target.style = "backgroundColor: yellow";
            // }}
          >
            {Number(typeId) !== 1 ? (
              <Stack spacing={2} direction="row">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleActivedropzone({
                      ...activeDropzone,
                      ...{ Id: props.ID, DocTypeId: props.DocTypeId },
                    });
                  }}
                  style={{
                    cursor: "pointer",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: label || "" }}
                  ></span>
                </Button>
              </Stack>
            ) : (
              label || ""
            )}

            {typeId !== "1" && (
              <Fragment>
                <Stack spacing={2} direction="row">
                  {/* <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setConditionalModalOpen(true);
                      setConditionDetails(props);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    className="btnRequirements"
                  >
                    Requirements
                  </Button> */}
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      fnCheckConditionalRemainingModel();
                      setConditionDetails(props);
                    }}
                    style={{
                      cursor: "pointer",
                      // color: "#ffffff",
                      // backgroundColor: "#f0ad4e",
                    }}
                    className="btnCondRemaning"
                  >
                    {props.PassedValidation === 1 ? (
                      "Conditions Completed"
                    ) : props.RemainingCount > 0 ? (
                      <>
                        <span
                          id="spnRemainingCount"
                          style={{ marginRight: "2px" }}
                        ></span>
                        <span> Conditions Remaining</span>
                      </>
                    ) : (
                      "Conditions Remaining"
                    )}
                  </Button>
                </Stack>
                {props.DocTypeId === 169 ? (
                  <>
                    {IncomeCalcProgres && (
                      <div>
                        <CircularProgress
                          size={15}
                          style={{ margin: "0px 5px 0px 15px" }}
                        />
                        <span
                          style={{ verticalAlign: "top", fontSize: "12px" }}
                        >
                          {" "}
                          Income Calculating...
                        </span>
                      </div>
                    )}
                    <span id="spnMonthlyIncomeMain"></span>
                    {/* <span
                      id="spnMonthlyIncome"
                      style={{ fontWeight: "bolder" }}
                    ></span> */}
                  </>
                ) : (
                  ""
                )}
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
        {MultipleProgressbar.length > 0 && (
          <div>
            {MultipleProgressbar.map((file) => {
              // debugger;
              return (
                <>
                  {file["isComplete"] ? (
                    <>
                      <div>
                        <DoneIcon
                          style={{ color: "green", fontWeight: "bolder" }}
                        ></DoneIcon>{" "}
                        {file["docMovedMessage"]} {" "}
                        <a
                          href="#"
                          className="ahrefcls"
                          onClick={(event) => {
                            props.handleSetValuetoDD(
                              file["docType"],
                              file["docTypeId"],
                              file["ScandocId"],
                              file["Confident_Score"]
                            );

                            if (Number(file["IsSaved"]) !== 1) {
                              setEnableSave(true);
                              if (file["docType"]?.toLowerCase() === "paystub")
                                setTimeout(() => {
                                  fnCheckBorrEntityExistsValidation(
                                    1,
                                    file["ParsedJson"]
                                  );
                                }, 10);
                            } else setEnableSave(false);

                            event.preventDefault();
                          }}
                          style={{
                            verticalAlign: "top",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <b>({file.name})</b>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div>
                      <CircularProgress
                        size={15}
                        style={{ margin: "0px 5px 0px 15px" }}
                      />
                      <span style={{ verticalAlign: "top", fontSize: "12px" }}>
                        {" "}
                        Extracting PDF <b>({file.name})</b>
                      </span>
                    </div>
                  )}
                </>
              );
            })}
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
