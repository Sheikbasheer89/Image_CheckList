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
import { Context, openNewWindow } from "./CommonFunction";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { handleAPI } from "./CommonFunction";
import { useDropzone } from "react-dropzone";
import DoneIcon from "@mui/icons-material/Done";
import { json } from "react-router-dom";
import DocTypeAhead from "./ASyncTypeAhead";
import { Tooltip } from "@mui/material";

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
    fnUpdateDocdeatails,
    TypeAheadDetails = "",
    setExtractionStatus = "",
  } = props;

  const {
    options,
    onChange,
    selectedOption,
    placeholder,
    label: ilabel,
    onKeyDown,
  } = TypeAheadDetails;
  // console.log("Props", props);
  const [ExtractProgres, setExtractProgres] = useState(false);
  const { contextDetails, setContextDetails } = useContext(Context);
  const [SelectedFile, setSelectedFile] = useState([]);
  const [OCRStatus, setOCRStatus] = useState("Extracting PDF");
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
    let selectedFiles = event.target.files;
    //debugger;
    // setExtractProgres(true);
    if (document.querySelector("#spnConfidenceScore") !== null)
      document.querySelector("#spnConfidenceScore").innerHTML = "";
    if (document.querySelector("#spnOCRStatus") !== null)
      document.getElementById("spnOCRStatus").innerHTML = "Extracting PDF";
      setExtractionStatus("Extracting PDF");
    try{
    setFieldExtractProgres(true);
    }
    catch(e){console.log(e)}
    // setDocTypeValue("0");
    setDocTypeValue(props.DocTypeId);
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
      if (i === 0) handleSetFile(file);
      setFeedBackCollection(true);
      var formdata = null;
      let IshugeFile = 0;
      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      formdata = new FormData();
      formdata.append("", fileInfo);

      if (fileSizeInMB > 10) IshugeFile = 1;

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
        IsHugeFile: IshugeFile,
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
        .then(async (result) => {
          // console.log(result);

          selectedFiles[i].JobId = result.split("~")[0];
          selectedFiles[i].isComplete = false;
          selectedFiles[i].IsHuge = IshugeFile;

          console.log(selectedFiles);

          if (Array.from(selectedFiles).length - 1 === i) {
            // if(IshugeFile == 1)
            //   await new Promise((resolve) => setTimeout(resolve, 600000));
            setSelectedFile(selectedFiles);
            await fnCheckJsonResponseLoop(selectedFiles);
          }
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

    async function fnCheckJsonResponseLoop(iselectedFiles) {
      let selectedFiles_ = iselectedFiles || SelectedFile;
      //debugger;
      let Counter = 0,
        FileCount = Array.from(selectedFiles_).length;

      // setTimeout(() => {

      for (let j = 0; j < FileCount; j++) {
        const file = Array.from(selectedFiles_ || SelectedFile)[j];
        // Array.from(selectedFiles_).forEach(
        // async (file) => {
        if (file && file.JobId !== undefined && file.isComplete === false) {
          const result = await handleAPIHuge({
            name: "fnMetaAPIStatusCheckPollingWithOutWait",
            params: {
              LoanId: Number(LoanId),
              JobId: file.JobId,
            },
          });
          // .then((result) => {
          // console.log(response);
          let CurrentStatus = JSON.parse(result.split("~")[0]);
          setOCRStatus(capitalizeEachWord(CurrentStatus.status).replace(/ocr/gi, 'OCR'));
          setExtractionStatus(capitalizeEachWord(CurrentStatus.status).replace(/ocr/gi, 'OCR'));
          document.getElementById("spnOCRStatus").innerHTML =
          capitalizeEachWord(CurrentStatus.status).replace(/ocr/gi, 'OCR');
          // document.getElementById("ExtractingStatus").innerHTML =
          // capitalizeEachWord(CurrentStatus.status).replace(/ocr/gi, 'OCR');
          
          if (
            !CurrentStatus.status.includes("Failed") &&
            !CurrentStatus.status.includes("Completed")
          ) {
            j--;
            continue;
          }

          if (
            CurrentStatus.status.includes("Completed") ||
            CurrentStatus.status.includes("Failed")
          ) {
            // let selectedFiles_ = selectedFiles,
            let fileType =
              JSON.parse(result.split("~")[0]).doc_type || "Miscellaneous";

            file.isComplete = true;
            if (CurrentStatus.status.includes("Failed"))
              file.docMovedMessage = capitalizeEachWord(CurrentStatus.status);
            else
              file.docMovedMessage = `This document is recognized as ${fileType} and was moved to ${fileType} section.`;
            file.docType = JSON.parse(result.split("~")[0])["doc_type"];
            file.docTypeId = props.DocTypeId;
            file.ScandocId = result.split("~")[1];
            file.confidence_score =
              JSON.parse(result.split("~")[0]).doc_type_confidence_score || "";

            let IsSaved = 1;
            if (result.split("~")[2] !== undefined)
              IsSaved = result.split("~")[2];
            file.IsSaved = IsSaved;

            file.ParsedJson = "";

            console.log(MultipleProgressbar);
            // Counter++;
            // CopyselectedFiles_.push(file);
            // if(Counter === FileCount)
            console.log(
              "CopyselectedFiles_",
              Array.from(selectedFiles_ || SelectedFile)
            );
            setMultipleProgressbar([
              ...[],
              ...Array.from(selectedFiles_ || SelectedFile),
            ]);
            // let iMultipleProgressbar = MultipleProgressbar
            // iMultipleProgressbar= iMultipleProgressbar.map((item_) => {

            //   item_.isComplete = item_.name == file.name
            //   return item_

            // })

            let getScandocId = result.split("~")[1];
            let CheckExtractionJsonNull = ''
            let iiParsedJson = JSON.parse(result.split("~")[0]);
              if (iiParsedJson != undefined) {
                if (
                  iiParsedJson.hasOwnProperty("extraction_json") &&
                  Array.isArray(iiParsedJson["extraction_json"])
                ) {
                  var extractionJsonArray = iiParsedJson["extraction_json"];
                  iiParsedJson = extractionJsonArray[0];
                }
              }

            if (
              getScandocId === undefined ||
              // result?.toString().indexOf("business_logic_json") === -1
              result?.toString().indexOf("extraction_json") === -1 ||
              JSON.parse(result.split("~")[0]).extraction_json === null || iiParsedJson === null
            ) {
              // setExtractProgres(false);
              setFieldExtractProgres(false);
              setExtractResult(result);
              setOriginalResJSON("");
              setScandocId(getScandocId);
              // fnPdfclassification(file, getScandocId, requestOptions);
              setWhichProcessMsg(0);
              fnGetLeaderLineSetup({});
              setOriginalResJSON(result.split("~")[0]);
            } else {
              setExtractResult("");
              setScandocId(getScandocId);
              let iresult = result.split("~")[0];
              // let ParsedJson = JSON.parse(result)["business_logic_json"];
              let ParsedJson = JSON.parse(iresult)["extraction_json"];
              let iParsedJson = JSON.parse(iresult);
              if (iParsedJson != undefined) {
                if (
                  iParsedJson.hasOwnProperty("extraction_json") &&
                  Array.isArray(iParsedJson["extraction_json"])
                ) {
                  var extractionJsonArray = iParsedJson["extraction_json"];
                  ParsedJson = extractionJsonArray[0];
                }
              }

              console.log(ParsedJson);
              fnGetLeaderLineSetup(ParsedJson);
              setOriginalResJSON(iresult);
              file.ParsedJson = ParsedJson;
              setFieldExtractProgres(false);
            }
          }
          // })
          // .catch((error) => {
          //   ////debugger;
          //   console.log("error", error);
          // });
        }
      }
      // );
      // }, 2000);
    }
  };

  function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}

  const handleAPIHuge = async ({ name, params, method }) => {
    params = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    let URL = `https://www.solutioncenter.biz/LoginCredentialsAPI/api/${name}?${params}`;

    try {
      // Make a fetch request with a readable stream response
      const response = await fetch(URL, {
        method: method || "POST",
        crossDomain: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.body) {
        console.log("Streaming not supported by this browser.");
        return;
      }

      // Initialize a response reader
      const reader = response.body.getReader();

      // Process the response in chunks
      const dataChunks = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        dataChunks.push(value);
        totalBytes += value.byteLength;

        // Adjust this limit as needed
        if (totalBytes >= 200 * 1024 * 1024) {
          // Handle the response or stop further processing
          console.log("Response exceeds 200 MB");
          break;
        }
      }

      // Combine the data chunks into a single buffer or string
      const combinedData = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of dataChunks) {
        combinedData.set(chunk, offset);
        offset += chunk.byteLength;
      }

      // Convert the response to the desired format, e.g., JSON
      const responseData = JSON.parse(
        new TextDecoder("utf-8").decode(combinedData)
      );

      return responseData;
    } catch (error) {
      console.log(`Error: ${error}`);
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
        ////debugger;
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
        style={
          typeId == 1
            ? {
                borderBottom: "1px solid #999",
                padding: "8px",
              }
            : {}
        }
        onClick={(event) => {
          // return;
          // //debugger;
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
            // margin: "15px 15px 7px 7px",
            display: typeId == 1 ? "inline-flex" : "-webkit-inline-box",
            width: "100%",
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
          <div
            className="drop-container"
            style={{
              borderWidth: "2px !important",
              borderStyle: "dashed",
              width: typeId == 1 ? "40%" : "105%",
              height: typeId != 1 ? "" : "50px",
            }}
          >
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
              style={{
                width: "100%",
                top: typeId == 1 ? "18px" : "null",
                fontSize: "10px"
              }}
            >
              {typeId == 1 ? "Click to Upload" : (<>Upload <div style={{fontWeight:"bold",justifyContent:'center',fontSize:11 }}>{label}</div></>) }
              
              {/* {props.ScanDocId > 0 ? (
                <>
                  Add a Document{" "}
                  <DoneIcon
                    style={{ color: "white", fontWeight: "bolder" }}
                  ></DoneIcon>
                </>
              ) : (
                "Click to Upload"
              )} */}
            </div>

            <input
              className={` ${
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
            {/* {Number(typeId) !== 1 ? (
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
            )} */}
            {TypeAheadDetails && typeId == 1 && (
              <div>
                <div>{label || ""}</div>
                <label>Search</label>
                <DocTypeAhead
                  label={ilabel}
                  options={options}
                  selectedOption={selectedOption}
                  onChange={onChange}
                  labelKey="DocType"
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
            {/* {typeId !== "1" && (
              <Fragment>
                <Stack spacing={2} direction="row">
                 
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      fnCheckConditionalRemainingModel();
                      console.log("Prop=", props);
                      setConditionDetails(props);
                    }}
                    style={{
                      cursor: "pointer",
                     
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
                    
                  </>
                ) : (
                  ""
                )}
              </Fragment>
              
            )} */}
          </span>
          {/* </div> */}
        </div>{" "}
        {MultipleProgressbar.length > 0 && (
          <div>
            {MultipleProgressbar.map((file, index) => {
              // //debugger;

              if (file["isComplete"] && !file["isClicked"]) {
                setTimeout(() => {
                  let aEle = document.querySelector("#fileLink_" + index);
                  aEle.click();
                  // aEle.removeAttribute("id");
                  let iMultipleProgressbar = MultipleProgressbar;
                  iMultipleProgressbar[index]["isClicked"] = true;
                  setMultipleProgressbar([...iMultipleProgressbar]);
                }, 500);
              }
              return (
                <>
                  {file["isComplete"] ? (
                    <>
                      <div
                        style={{ overflowWrap: "anywhere", display: "block" }}
                      >
                        <DoneIcon
                          style={{ color: "green", fontWeight: "bolder" }}
                        ></DoneIcon>{" "}
                        {file["docMovedMessage"]}{" "}
                        <a
                          id={"fileLink_" + index}
                          href="#"
                          className="ahrefcls"
                          onClick={(event) => {
                            handleAPI({
                              name: "GetUploadedDetails",
                              params: {
                                LoanId: LoanId,
                                DoctypeId: file["ScandocId"],
                              },
                            })
                              .then((response) => {
                                // console.log(response);
                                response = JSON.parse(response);

                                response.forEach((e) => {
                                  let docType = e.SDT[0];
                                  delete e.SDT;
                                  e["ShortName"] = docType["ShortName"];
                                });
                                // debugger;
                                // response[0].MultipleProgressbar = file
                                if (!file.AlreadyClicked)
                                  fnUpdateDocdeatails(response);
                                file.AlreadyClicked = true;

                                props.handleSetValuetoDD(
                                  file["docType"],
                                  file["docTypeId"],
                                  file["ScandocId"],
                                  file["Confident_Score"],
                                  2,
                                  response
                                );

                                if (Number(file["IsSaved"]) !== 1) {
                                  setEnableSave(true);
                                  if (
                                    file["docType"]?.toLowerCase() === "paystub"
                                  )
                                    setTimeout(() => {
                                      fnCheckBorrEntityExistsValidation(
                                        1,
                                        file["ParsedJson"]
                                      );
                                    }, 10);
                                } else setEnableSave(false);

                                event.preventDefault();
                                // console.log(response);
                              })
                              .catch((error) => {
                                ////debugger;
                                console.log("error", error);
                              });
                          }}
                          style={{
                            verticalAlign: "top",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <b>({file.name})</b>
                        </a>{" "}
                        {file.IsHuge == 1 && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                const isDev =
                                  window.location.hostname.includes(
                                    "localhost"
                                  );
                                let URL = `/SubDocumentFileResult?LoanId=${LoanId}&SessionId=${SessionId}&JobId=${
                                  file["JobId"] || 0
                                }`;
                                // URL = isDev ? "localhost:3000" : "";

                                if (!isDev) URL = `/imagechecklistreact${URL}`;
                                let NewWindow = window.open(
                                  URL,
                                  "_blank",
                                  "width=1200,height=1200,resizable=yes,scrollbars=yes"
                                );
                                NewWindow.opener = window;
                              }}
                              style={{
                                cursor: "pointer",
                                color: "#fff",
                                backgroundColor: "#428bca",
                                marginLeft: 2,
                              }}
                              className=""
                            >
                              View Results
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ overflowWrap: "anywhere", display: "block" }}>
                      <CircularProgress
                        size={25}
                        style={{ margin: "0px 5px 0px 5px" }}
                      />
                      <span style={{ verticalAlign: "top", fontSize: "12px" }}>
                        {" "}
                        <span id="spnOCRStatus">Extracting PDF</span>{" "}
                        <b>({file.name})</b>
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
      <span
        id="ViewSubFiles"
        style={{ display: "none" }}
        onClick={() => {
          console.log(
            document.getElementById("ViewSubFiles").getAttribute("ScandocId")
          );
          handleAPI({
            name: "GetUploadedDetails",
            params: {
              LoanId: LoanId,
              DoctypeId: document.getElementById("ViewSubFiles").getAttribute("ScandocId"),
            },
          })
            .then((response) => {
              // console.log(response);
              response = JSON.parse(response);
              debugger;

              response.forEach((e) => {
                let docType = e.SDT[0];
                delete e.SDT;
                e["ShortName"] = docType["ShortName"];
              });
              // file.AlreadyClicked = true;

              props.handleSetValuetoDD(
                response[0]?.Descript,
                response[0]?.DocTypeId,
                document.getElementById("ViewSubFiles").getAttribute("ScandocId"),
                response[0]?.Confident_Score,
                1,
                response
              );

              // if (Number(file["IsSaved"]) !== 1) {
              //   setEnableSave(true);
              //   if (response.Descript?.toLowerCase() === "paystub")
              //     setTimeout(() => {
              //       fnCheckBorrEntityExistsValidation(1, file["ParsedJson"]);
              //     }, 10);
              // } else setEnableSave(false);

              // event.preventDefault();
              // console.log(response);
            })
            .catch((error) => {
              ////debugger;
              console.log("error", error);
            });
        }}
      ></span>
    </>
  );
}

export default DropZone;
