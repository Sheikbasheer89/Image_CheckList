import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import { Document, Page, pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "bootstrap/dist/css/bootstrap.css";
import "../Components/ImageCheckList.css";
import "../Components/BoostrapOld.css";
import DropZone from "./DropZone";
import {
  handleAPI,
  TextBox,
  DropDown,
  Context,
  openNewWindow,
  fnSaveWindowPosition,
} from "./CommonFunction";
import Modal from "../Components/Modal";
import LeaderLine from "leader-line";
import { pdfjs } from "react-pdf";
import ConditionalModal from "./ConditionModal";
import ControlPanel from "./PdfViewerTools";
import MenuOptions from "./MenuOption";

import CustomizedSnackbars from "./MessageComponents";
import ConditionalRemainingCompleteModel from "./ConditionRemainingCompleted";
import { Unarchive } from "@mui/icons-material";
import ChangeLog from "./ChangeLog";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const { contextDetails, setContextDetails } = useContext(Context);
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [file, setFile] = useState(null);
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
  const [modalOpen, setModalOpen] = useState(false);
  const [IsBorrExists, setIsBorrExists] = useState(1);
  const [IsEntityExists, setIsEntityExists] = useState(1);
  const [BorrLists, setBorrLists] = useState("");
  const [EntityLists, setEntityLists] = useState("");
  const [WhichBorrower, setWhichBorrower] = useState("0");
  const [WhichEnity, setWhichEnity] = useState("0");
  const [line, setLine] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState([]);
  const [UploadedDocValue, setUploadedDocValue] = useState("0");
  const [DocChangeFlag, setDocChangeFlag] = useState(false);

  const [ExtractResult, setExtractResult] = useState("");

  const [ConditionalRemainingModel, setConditionalRemainingModel] =
    useState(false);

  const [conditionDetails, setConditionDetails] = useState(null);

  const [conditionalModalOpen, setConditionalModalOpen] = useState(false);
  const [isUploadDocChecked, setIsUploadDocChecked] = useState(false);
  const [uploadedDocDetails, setUploadedDocDetails] = useState({
    UploadedBy: "",
  });

  const [activeDropzone, setActiveDropzone] = useState({ Id: 0, DocTypeId: 0 });
  const [checkIcon, setcheckIcon] = useState({
    Entity: false,
    Borrower: false,
  });

  const [OriginalResponsefromAPI, setOriginalResponsefromAPI] = useState(null);
  const [ShowError, setShowError] = useState("0");

  const [scale, setScale] = React.useState(1);

  const [showTools, setShowTools] = useState("0");
  const [scandocId, setScandocId] = useState("");

  const [ChangeLogModalOpen, setChangeLogModalOpen] = useState(false);

  const [ChangeLogData, setChangeLogData] = useState([]);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [entityTypeId, setEntityTypeId] = useState("");

  const [rotation, setrotation] = useState(0);

  const [PdfElements, setPdfElements] = useState([]);

  const [userId, setUserId] = useState(0);
  const [userType, setUserType] = useState("");

  const [openMsg, setOpenMsg] = useState(false);

  const [DocCheck, setDocCheck] = useState("");

  const [PassedDoc, setPassedDoc] = useState([]);

  const [WhichProcessMsg, setWhichProcessMsg] = useState(0);

  const options = {
    cMapUrl: "cmaps/",
    standardFontDataUrl: "standard_fonts/",
  };

  const [CondRemaining, setCondRemaining] = React.useState([]);
  const [ValidationMsg, setValidationMsg] = React.useState("");
  const [CondCompleted, setCondCompleted] = React.useState([]);

  function fnCheckConditionalRemainingModel() {
    setConditionalRemainingModel(true);
  }

  function fnRunImageValidation(flag) {
    handleAPI({
      name: "RunImageValidation",
      params: {
        // scandocid: scandocId,
        scandocid:
          scandocId !== "" && scandocId
            ? scandocId
            : uploadedDocDetails["ScanDocId"],
        UserID: userId,
      },
    })
      .then((response) => {
        // console.log(response);
        debugger;

        let dataarray = response.split("~~~~");

        if (flag === 1) {
          fnPageload(LoanId, userId, userType);
          if (dataarray[0] == "1") {
            setWhichProcessMsg(1);
            setOpenMsg(true);
          }
          return;
        }
        let validationmsg = "";
        if (response.Message !== undefined || file === null) {
          validationmsg =
            "Image Data is not availabe for Validation, please update and run again.";

          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted([]);
        }

        if (dataarray[0] == "1") {
          validationmsg = "This Document Passes Validation";
          // console.log(uploadedDocDetails.PassedValidation);
          setUploadedDocDetails({ ...uploadedDocDetails, PassedValidation: 1 });
          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted([]);
        } else if (dataarray[0] == "-1") {
          validationmsg = "Document Refer Reasons";
          setValidationMsg(validationmsg);
          let ResultJSON = JSON.parse(dataarray[1]).ValidationMessages;
          let CompletedJSON = JSON.parse(dataarray[2]).CompletedMessages;
          // debugger;
          setCondRemaining(ResultJSON);
          setCondCompleted(CompletedJSON);
        } else if (dataarray[0] == "-98") {
          validationmsg =
            "Image Data is not availabe for Validation, please update and run again.";

          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted([]);
        } else if (dataarray[0] == "-90") {
          validationmsg =
            "Image Validation Failed. Please try again or contact support.";

          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted([]);
        } else {
          validationmsg =
            "There Are No Validation Rules For This Document Type.";

          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted([]);
        }
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }

  const GetAPIChangeLog = (iLoanId, iDbFieldId, iScanDocId) => {
    let Result = [];
    handleAPI({
      name: "GetAPIChangeLog",
      params: {
        LoanId: iLoanId,
        DbFieldId: iDbFieldId,
        ScanDocId: iScanDocId,
      },
    })
      .then((response) => {
        console.log(response);
        Result = JSON.parse(response).Table[0].Result;
        setChangeLogData(Result);
        setChangeLogModalOpen(true);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (ConditionalRemainingModel) fnRunImageValidation();
    else {
      setCondRemaining([]);
      setValidationMsg("");
    }
  }, [ConditionalRemainingModel]);

  const formatCurrency = (value, decPlaces) => {
    let num = value,
      multiplier = Math.pow(10, decPlaces),
      rounder = 50 / multiplier + 0.00000000001,
      i = 0,
      cents = num % multiplier,
      sign = num == (num = Math.abs(num));

    num = num.toString().replace(/\$|\,/g, "");

    if (isNaN(num)) num = "0";

    if (isNaN(decPlaces)) num = "2";

    num = Math.floor(num * multiplier + rounder);

    num = Math.floor(num / multiplier).toString();

    for (i = 1; i < decPlaces; i++) {
      if (cents < Math.pow(10, i)) cents = "0" + cents;
    }

    for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        "," +
        num.substring(num.length - (4 * i + 3));

    return "$" + ((sign ? "" : "-") + num);
  };

  const handleFindFormToElements = (e, isDraw, value) => {
    if (value === "" || value === undefined) return false;
    // console.log("handleFindFormToElements");
    let eleFrom = e.target,
      eleTo = PdfElements.filter(
        (ele) =>
          ele.textContent.toLowerCase() ===
          value.toString().replaceAll("$", "").toLowerCase()
      );
    if (eleTo.length == 0) {
      // debugger;
      let PdfEle = Array.from(document.querySelectorAll(".textLayer span"));
      // let PdfEle = Array.from(document.querySelectorAll("span"));
      eleTo = PdfEle.filter(
        (ele) =>
          ele.textContent
            .toString()
            .replaceAll("$", "")
            .replaceAll(".00", "")
            .toLowerCase()
            .trim() ===
          value
            .toString()
            .replaceAll("$", "")
            .replaceAll(".00", "")
            .toLowerCase()
            .trim()
      );

      if (eleTo.length == 0) {
        eleTo = PdfEle.filter(
          (ele) =>
            ele.textContent.toString().replaceAll("$", "").toLowerCase() ===
            value
              .toString()
              .split(" ")
              [value.toString().split(" ").length - 1].replaceAll("$", "")
              .toLowerCase()
        );
      }

      if (eleTo.length == 0) {
        eleTo = PdfEle.filter(
          (ele) =>
            ele.textContent
              .toString()
              .replaceAll("$", "")
              .toLowerCase()
              .indexOf(value.toString().replaceAll("$", "").toLowerCase()) > -1
        );
      }

      setPdfElements([...PdfElements, ...eleTo]);
    }
    if (eleFrom !== null && eleTo !== null) {
      if (isDraw) handleDrawLine(eleFrom, eleTo, isDraw);
    }
  };

  const coordinates = {
    x1: 38.62476140563488,
    y1: 755.526302807262,
    x2: 207.7311904551647,
    y2: 771.4453715427553,
  };

  const extractText = async () => {
    try {
      const pdf = await pdfjs.getDocument(file).promise;
      const textSpans = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const pageTextContent = await page.getTextContent();

        pageTextContent.items.forEach((item) => {
          const { transform, str } = item;
          const [x, y] = transform;
          const [mappedX, mappedY] = viewport.convertToPdfPoint(x, y);

          if (
            mappedX >= coordinates.x1 &&
            mappedY >= coordinates.y1 &&
            mappedX <= coordinates.x2 &&
            mappedY <= coordinates.y2
          ) {
            textSpans.push(str);
          }
        });
      }

      // setTextSpans(textSpans);
      console.log(textSpans);
    } catch (error) {
      console.error("Error extracting text:", error);
    }
  };

  const findTextLayerSpans = async () => {
    const pdfUrl = file; // Replace with the actual path to your PDF file
    const searchArea = {
      x0: 38.62476140563488,
      y0: 755.526302807262,
      x1: 207.7311904551647,
      y1: 771.4453715427553,
    }; // Replace with the coordinates of the search area

    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const textLayerSpans = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      const textContent = await page.getTextContent();
      const textLayer = textContent.items.reduce((layer, item) => {
        const { transform, width, height, str } = item;
        const [x, y] = transform;

        const x0 = x * viewport.width;
        const y0 = viewport.height - y * viewport.height - height;
        const x1 = x0 + width;
        const y1 = y0 + height;

        if (
          searchArea.x0 <= x1 &&
          searchArea.y0 <= y1 &&
          searchArea.x1 >= x0 &&
          searchArea.y1 >= y0
        ) {
          if (
            layer.length > 0 &&
            y0 === layer[layer.length - 1].y &&
            x0 > layer[layer.length - 1].x1
          ) {
            // Combine adjacent text elements
            layer[layer.length - 1].str += " " + str;
            layer[layer.length - 1].x1 = x1;
          } else {
            layer.push({ str, x0, y0, x1, y1 });
          }
        }

        return layer;
      }, []);

      textLayerSpans.push(...textLayer);
    }

    // setTextLayerSpans(textLayerSpans);
    console.log(textLayerSpans);
  };

  const handleDrawLine = (eleFrom, eleTo, isDraw) => {
    try {
      if (eleFrom && eleTo) {
        let ele = eleTo[0];
        handleRemoveLine();

        if (document.querySelectorAll(".txtHighlight")?.length > 0) {
          document
            ?.querySelector(".txtHighlight")
            ?.classList.remove("txtHighlight");
        }
        try {
          if (ele.classList !== undefined) ele?.classList.add("txtHighlight");
        } catch (e) {}

        try {
          var line_ = new LeaderLine(eleFrom, ele, {
            color: "blue",
            size: 2.5,
            path: "fluid",
            // startPlug: "disc",
          });
          // var line_ = new LeaderLine(
          //   eleFrom,
          //   LeaderLine.pointAnchor(ele, {
          //     x: 379.6327973019661,
          //     y: 688.0023458332364,
          //   }),
          //   {
          //     color: "blue",
          //     size: 2.5,
          //     path: "fluid",
          //     // startPlug: "disc",
          //   }
          // );
        } catch (error) {
          console.log(error);
          handleRemoveLine();
        }
        setLine(line_);
      }
    } catch (error) {
      console.log("LeaderLine", error);
      handleRemoveLine();
    }
  };
  const handleRemoveLine = () => {
    try {
      if (line) {
        //  console.log("handleRemoveLine");

        line.remove();
        setLine(null);
      }
    } catch (error) {
      console.log("Error handleRemoveLine");
      document.querySelector(".leader-line")?.remove();
    }
  };

  const fnValueChange = (e) => {
    // debugger;
    let { name, value } = e.target;
    setDetails({ ...Details, [name]: value });
    setDocTypeValue(value);
    setEnableSave(true);
    // setCategory(catType);
    // setEntityTypeId(entityType);
    setDescription(e.target.selectedOptions[0].text);
  };

  const fnBorrEntityValueChange = (e) => {
    // debugger;
    let { name, value, flag } = e;
    if (flag == 0) {
      setWhichBorrower(value);
    }
    if (flag == 1) {
      setWhichEnity(value);
    }
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
    setShowTools("1");
    setTimeout(() => {
      if (OriginalResJSON) {
        let ParsedJson = JSON.parse(OriginalResJSON)["business_logic_json"];
        fnGetLeaderLineSetup(ParsedJson);
        handleSetValuetoDD(JSON.parse(OriginalResJSON)["doc_type"]);
      }
    }, 500);
  }

  function fnRemoveDuplicate(array, key) {
    const isEqual = (obj1, obj2, key) => {
      if (key.includes(".")) {
        const keys = key.split(".");
        return obj1[keys[0]][keys[1]] === obj2[keys[0]][keys[1]];
      }
      return obj1[key] === obj2[key];
    };

    // Reduce the array to remove duplicates based on the 'name' key
    const uniqueArray = array.reduce((accumulator, currentObject) => {
      if (!accumulator.some((obj) => isEqual(obj, currentObject, key))) {
        accumulator.push(currentObject);
      }
      return accumulator;
    }, []);

    return uniqueArray;
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    let div = document.querySelector("#divDropZoneWrapper");

    if (div) {
      let height =
        document.querySelector(".react-tabs__tab-list").offsetHeight / 10;
      div.style.maxHeight = 67.8 - height + "vh";
    }
  };
  function fnPageload(iLoanId, iUserId, iUserType, flag, UploadedDocTypeId) {
    handleAPI({
      name: "GetUWStatusChecklistData",
      params: {
        LoanId: iLoanId,
        formparam: "",
        TypeId: 1,
        UserType: iUserType,
        Id: 1,
        EmpNum: iUserId,
      },
    })
      .then((response) => {
        // console.log(response);
        response = JSON.parse(response);
        // console.log(response);
        debugger;
        let docDec = JSON.parse(response["Table"][0].Column1)[0] || [];
        if (response["Table"][0].Column2 === "")
          response["Table"][0].Column2 = "[]";
        let UploadedDocFiles = JSON.parse(response["Table"][0].Column2) || [],
          totalArr = JSON.parse(response["Table1"][0].Result) || [],
          resultArr = totalArr.filter(
            (obj1) =>
              !UploadedDocFiles.some(
                (obj2) => Number(obj2.ScanDocId) === Number(obj1.ScanDocId)
              )
          );

        resultArr.forEach((e) => {
          let docType = e.SDT[0];
          delete e.SDT;
          e["ShortName"] = docType["ShortName"];
        });

        docDec = [...docDec, ...resultArr];

        let FilteredPassedValidation1 = totalArr.filter(
          (e) => Number(e.PassedValidation) === 1
        );

        FilteredPassedValidation1 = fnRemoveDuplicate(
          FilteredPassedValidation1,
          "DocTypeId"
        );
        // debugger;
        let PassedDoc = FilteredPassedValidation1.filter((obj1) =>
          docDec.some(
            (obj2) => Number(obj2.DocTypeId) === Number(obj1.DocTypeId)
          )
        );

        setPassedDoc(PassedDoc);

        if (FilteredPassedValidation1.length > 0)
          docDec = docDec.filter((obj1) =>
            FilteredPassedValidation1.some(
              (obj2) => Number(obj2.DocTypeId) !== Number(obj1.DocTypeId)
            )
          );

        UploadedDocFiles = [...resultArr, ...UploadedDocFiles];
        setDocDetails(docDec);

        setUploadedDocument(UploadedDocFiles);
        //  console.log("resultArr[0]", resultArr[0]);
        if (!DocChangeFlag) {
          // alert(resultArr[0]["ScanDocId"]);
          setUploadedDocValue(resultArr[0]["ScanDocId"]);
        }
        setDocChangeFlag(false);
        if (flag === 1) {
          let FilterDoc = docDec.filter(
            (item) => item.DocTypeId === UploadedDocTypeId
          );
          //  console.log(FilterDoc);
          if (FilterDoc.length > 0) {
            handleActivedropzone(
              {
                ...activeDropzone,
                ...{ Id: FilterDoc[0].ID, DocTypeId: FilterDoc[0].DocTypeId },
              },
              flag
            );
          }
        }
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
    if (flag === undefined)
      //When page load
      handleAPI({
        name: "GetDocumentType",
        params: { LoanId: iLoanId },
      })
        .then((response) => {
          // console.log(response);
          response = JSON.parse(response);
          setDocType(response);
          // console.log(response);
        })
        .catch((error) => {
          //debugger;
          console.log("error", error);
        });
  }
  useEffect(() => {
    // debugger;
    // console.log("LoanIddd", LoanId);
    handleResize();
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    setLoanId(searchParams.get("LoanId"));
    setContextDetails({
      ...{},
      ...{ loanId: searchParams.get("LoanId") },
    });
    setSessionId(searchParams.get("SessionId"));

    // debugger;

    handleAPI({
      name: "GetUsersDetails",
      params: { SessionId: searchParams.get("SessionId") },
    })
      .then((response) => {
        // console.clear();
        //  console.log(response);
        let UserId = response.split("~")[0];
        let UserType = response.split("~")[2];

        if (UserId == 0) {
          window.location.href =
            "https://directcorp.com/Login/Presentation/Webforms/LoginInline.aspx";
          return;
        }

        setUserId(UserId);
        setUserType(UserType);
        fnPageload(searchParams.get("LoanId"), UserId, UserType);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }, [LoanId]);

  function fnGetImagefromServer(ScandocId) {
    handleAPI({
      name: "GetUploadedImageWithJSON",
      params: { ScandocId: ScandocId, ViewType: 0, SessionId: setSessionId },
    })
      .then((response) => {
        let PdfPath = `https://www.directcorp.com/PDF/${
          response.split("~")[0]
        }`;
        let Json = response.split("~")[1];
        setFile(PdfPath);
        // if (Json instanceof String)

        if (response.split("~")[2]?.trim() ?? "") {
          setOriginalResponsefromAPI(response.split("~")[2]);
        } else {
          setOriginalResponsefromAPI(null);
          if (Json.toString().indexOf("{") === -1) setResJSON([]);
        }

        if (
          Json.toString().indexOf("status code") === -1 &&
          Json.toString().indexOf("Error") === -1
        )
          setOriginalResJSON(Json);
        else setOriginalResJSON("");
        // else setOriginalResJSON(Json);

        // console.log(PdfPath);
        // console.log(Json);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }

  const handleSetValuetoDD = (docType, OrgDocId) => {
    let UploadedDocTypeId = 0;
    if (docType !== undefined && DocType !== "") {
      let Filterdoctype = DocType.filter((items) => {
        return (
          items.DocType.toString().replaceAll(" ", "").toLowerCase() ===
          docType.toLowerCase()
        );
      });

      if (Filterdoctype.length > 0) {
        setDocTypeValue(Filterdoctype[0].Id);
        // debugger;
        setCategory(Filterdoctype[0].CategoryType);
        setEntityTypeId(Filterdoctype[0].iEntityType);
        setDescription(Filterdoctype[0].DocType);
        if (OrgDocId && Filterdoctype[0].Id !== OrgDocId) {
          setWhichProcessMsg(0);
          setOpenMsg(true);
          setDocCheck(Filterdoctype[0].DocType);
          debugger;
          // console.log(activeDropzone);
          UploadedDocTypeId = Filterdoctype[0].Id;
        }
      }
    }
    fnPageload(LoanId, userId, userType, 1, UploadedDocTypeId);
  };

  function fnGetLeaderLineSetup(obj) {
    debugger;

    if (obj) {
      setResJSON(obj);
      let ele = [],
        PdfEle = Array.from(document.querySelectorAll(".textLayer span")),
        KeyValues = Object.values(obj).map((val) =>
          val.toString().replaceAll("$", "").toLowerCase()
        );

      ele = PdfEle.filter(
        (ele) =>
          KeyValues.toString()
            .toLowerCase()
            .indexOf(
              ele.textContent.toString().replaceAll("$", "").toLowerCase()
            ) !== -1
      );

      // if (ele.length !== Object.values(obj).length) {
      //   debugger;
      //   ele = PdfEle.filter(
      //     (ele) => KeyValues.indexOf(ele.textContent.toLowerCase()) !== -1
      //   );
      // }

      setPdfElements(ele);
    } else {
      setResJSON([]);
    }
  }

  function fnSaveFieldsToDW() {
    setShowError("0");
    if (!fnValidationCheckbeforeSave()) {
      setShowError("1");
    } else {
      setModalOpen(false);

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

      // debugger;

      handleAPI({
        name: "UpdateResponseInDW",
        params: {
          LoanId: LoanId,
          FilterJSON: FilterJSON,
          IsBorExists: WhichBorrower != 0 && WhichBorrower != -1 ? 1 : 0,
          IsEntityExists: WhichEnity != 0 && WhichEnity != -1 ? 1 : 0,
          BorId: WhichBorrower != 0 && WhichBorrower != -1 ? WhichBorrower : 0,
          EntityId: WhichEnity != 0 && WhichEnity != -1 ? WhichEnity : 0,
          ScandocId:
            scandocId !== "" && scandocId
              ? scandocId
              : uploadedDocDetails["ScanDocId"],
          docTypeId: DocTypeValue,
          Descript: description,
          Category: category,
          UseDoc: uploadedDocDetails.UseDoc,
        },
      })
        .then((response) => {
          console.log(response);
          handleFooterMsg("Saved Successfully.");
          fnSendFeedbacktoAPI();
          setWhichBorrower(0);
          setWhichEnity(0);
          fnRunImageValidation(1);

          // response = JSON.parse(response);
          // console.log(response);
        })
        .catch((error) => {
          //debugger;
          console.log("error", error);
        });
    }
  }

  function fnValidationCheckbeforeSave() {
    let IsValidated = true;

    // if (
    //   IsBorrExists == 0 &&
    //   WhichBorrower == 0 &&
    //   checkIcon["Borrower"] == false
    // )
    //   IsValidated = false;
    // if (IsEntityExists == 0 && WhichEnity == 0 && checkIcon["Entity"] == false)
    //   IsValidated = false;

    return IsValidated;
  }

  function fnCheckBorrEntityExistsValidation() {
    debugger;
    let FilterJSON = {};
    FilterJSON = JSON.stringify(ResJSON);

    handleAPI({
      name: "EntityBorrCheckValidation",
      params: {
        LoanId: LoanId,
        FilterJSON: FilterJSON,
      },
    })
      .then((response) => {
        // console.log(response);
        let SplitRes = response.split("~");
        let BorrExists = SplitRes[0];
        let EntityExists = SplitRes[1];
        let BorrLists = SplitRes[2];
        let EntityLists = SplitRes[3];

        if (Number(BorrExists) === 1 && Number(EntityExists) === 1) {
          fnSaveFieldsToDW();
        } else {
          setIsBorrExists(BorrExists);
          setIsEntityExists(EntityExists);
          setBorrLists(BorrLists);
          setEntityLists(EntityLists);
          setModalOpen(true);
        }
        setEnableSave(false);
        // setModalOpen(true);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }
  // useEffect(() => {
  //   if (
  //     document.querySelector(".react-tabs__tab.react-tabs__tab--selected")
  //       .innerText === "Documents Uploaded"
  //   ) {
  //     let activeScandocId = uploadedDocument.filter(
  //       (item) =>
  //         item.ID === activeDropzone.Id &&
  //         item.DocTypeId === activeDropzone.DocTypeId
  //     );
  //     if (activeScandocId.length > 1) {
  //       activeScandocId = activeScandocId[0]["ScanDocId"];
  //     }
  //     let UploadedMonthlyIncome = uploadedDocument.filter(
  //       (item) => item.ScanDocId == activeScandocId
  //     );
  //     debugger;
  //     // let MonthlyIncomeDetails = `<b>Monthly Income Calculated:</b><br>${ResJSON["Name of Employer"]}   ${UploadedMonthlyIncome[0]?.MonthlyIncome} (${ResJSON["Which Borrower"]})<br><b>Total Monthly Income</b><br>${UploadedMonthlyIncome[0]?.MonthlyIncome}`;

  //     if (document.getElementById("spnMonthlyIncomeMain") != null) {
  //       document.getElementById("spnMonthlyIncomeMain").innerHTML =
  //         UploadedMonthlyIncome[0]?.IncomeDetails;
  //     }
  //   }
  // }, [ResJSON]);
  function handleActivedropzone(activeDropzone, flag) {
    setActiveDropzone(activeDropzone);
    let activeScandocId = uploadedDocument.filter(
      (item) =>
        item.ID === activeDropzone.Id &&
        item.DocTypeId === activeDropzone.DocTypeId
    );
    // console.log(activeScandocId);
    // debugger;
    if (activeScandocId.length > 0) {
      activeScandocId = activeScandocId[0].ScanDocId || 0;
      if (activeScandocId !== 0)
        handleDocumentUploadChange(activeScandocId, flag);
      setShowTools(1);

      let UploadedMonthlyIncome = uploadedDocument.filter(
        (item) => item.ScanDocId == activeScandocId
      );
      setScandocId(activeScandocId);
      console.log(ResJSON);

      if (document.getElementById("spnMonthlyIncomeMain") != null) {
        document.getElementById("spnMonthlyIncomeMain").innerHTML =
          UploadedMonthlyIncome[0]?.IncomeDetails;
      }
      // debugger;
      // let MonthlyIncomeDetails = `<b>Monthly Income Calculated:</b><br>${ResJSON["Name of Employer"]}   ${UploadedMonthlyIncome[0]?.MonthlyIncome} (${ResJSON["Which Borrower"]})<br><b>Total Monthly Income</b><br>${UploadedMonthlyIncome[0]?.MonthlyIncome}`;

      // if (document.getElementById("spnMonthlyIncomeMain") != null) {
      //   document.getElementById("spnMonthlyIncomeMain").innerHTML =
      //     MonthlyIncomeDetails;
      // }

      // if (document.getElementById("spnMonthlyIncome") != null)
      //   document.getElementById("spnMonthlyIncome").innerHTML =
      //     UploadedMonthlyIncome[0]?.MonthlyIncome;
      if (document.getElementById("spnRemainingCount") != null)
        document.getElementById("spnRemainingCount").innerHTML =
          UploadedMonthlyIncome[0]?.RemainingCount;
    } else {
      setFile(null);
      setResJSON({});
      setShowTools(0);
      uploadedDocDetails["ScanDocId"] = "";
      uploadedDocDetails.PassedValidation = 0;
    }
  }
  // useEffect(() => {
  //   // console.log("UploadedDocValue", UploadedDocValue);
  //   if (UploadedDocValue !== 0) handleDocumentUploadChange(UploadedDocValue);
  // }, [activeDropzone]);

  const handleDocumentUploadChange = (value, flag) => {
    if (
      value == 0 &&
      document.querySelector(".react-tabs__tab.react-tabs__tab--selected")
        .innerText === "Documents Uploaded"
    ) {
      document.getElementById("spnMonthlyIncomeMain").innerHTML = "";
    }
    if (value === undefined) value = UploadedDocValue;
    // console.log("value =", value);

    if (flag !== 1) setUploadedDocValue(value);
    fnGetImagefromServer(value);
    let isChecked = "0",
      checkedIndex = uploadedDocument.filter(
        (e) => Number(e["ScanDocId"]) === Number(value)
      );
    if (checkedIndex && Number(value) !== 0) {
      checkedIndex = checkedIndex[0];
      if (
        Number(checkedIndex["UseDoc"]) === 2 ||
        Number(checkedIndex["UseDoc"]) === 3
      ) {
        isChecked = "1";
      }
    }
    // setIsUploadDocChecked(isChecked);
    setUploadedDocDetails(checkedIndex);
  };

  function fnFrequencyValue(FreqValue) {
    if (!isNaN(FreqValue)) return FreqValue;
    const value = FreqValue?.toString().replace("-", "").toLowerCase();

    if (value.indexOf("hourly") > -1) return 1;
    if (value.indexOf("biweekly") > -1) return 3;
    if (value.indexOf("weekly") > -1) return 2;
    if (value.indexOf("bimonthly") > -1) return 5;
    if (value.indexOf("monthly") > -1) return 4;
    if (value.indexOf("annual") > -1) return 6;
    if (value.indexOf("voe") > -1) return 7;

    return 0;
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
      "https://www.solutioncenter.biz/LoginCredentialsAPI/api/SendFeedbacktoAPI?LoanId=" +
        LoanId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        //    console.log(result);
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

  const isUploadedDocChecked = () => {
    return { checked: !false };
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
          style={{ padding: " 10px 4px", zIndex: 999 }}
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
                    fnGetLeaderLineSetup={fnGetLeaderLineSetup}
                    setOriginalResJSON={setOriginalResJSON}
                    LoanId={LoanId || 0}
                    SessionId={SessionId || ""}
                    {...{
                      DocTypeId: "269",
                      Category: "3",
                      LongDesc: "Miscellaneous",
                      ShortName: "Miscellaneous",
                      ID: "-99",
                      EntityId: "0",
                      EntityTypeId: "1",
                    }}
                    setEnableSave={setEnableSave}
                    handleSetValuetoDD={handleSetValuetoDD}
                    setConditionalModalOpen={setConditionalModalOpen}
                    setScandocId={setScandocId}
                    handleActivedropzone={handleActivedropzone}
                    activeDropzone={activeDropzone}
                    setExtractResult={setExtractResult}
                    setWhichProcessMsg={setWhichProcessMsg}
                    setOpenMsg={setOpenMsg}
                    setDocCheck={setDocCheck}
                  />
                  <div
                    id="divDropZoneWrapper"
                    style={{
                      maxHeight: "68vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {DocDetails.filter(
                      (e) =>
                        e.PassedValidation === 0 ||
                        e.PassedValidation === undefined
                    )
                      .filter(
                        (
                          (s) => (o) =>
                            ((k) => !s.has(k) && s.add(k))(
                              ["ID", "DocTypeId"].map((k) => o[k]).join("|")
                            )
                        )(new Set())
                      )
                      .map((item, index) => {
                        return (
                          <DropZone
                            typeId={item["DocTypeId"]}
                            label={item["ShortName"]}
                            handleSetFile={handleSetFile}
                            fnGetLeaderLineSetup={fnGetLeaderLineSetup}
                            {...item}
                            key={index}
                            setOriginalResJSON={setOriginalResJSON}
                            LoanId={LoanId || 0}
                            SessionId={SessionId || ""}
                            handleSetValuetoDD={handleSetValuetoDD}
                            setEnableSave={setEnableSave}
                            setConditionalModalOpen={setConditionalModalOpen}
                            setConditionDetails={setConditionDetails}
                            setScandocId={setScandocId}
                            handleActivedropzone={handleActivedropzone}
                            activeDropzone={activeDropzone}
                            fnCheckConditionalRemainingModel={
                              fnCheckConditionalRemainingModel
                            }
                            setExtractResult={setExtractResult}
                            setWhichProcessMsg={setWhichProcessMsg}
                            setOpenMsg={setOpenMsg}
                            setDocCheck={setDocCheck}
                          />
                        );
                      })}
                    <div class="pagebottom">
                      <span class="footertext">Column Bottom</span>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div
                    id="divUploadedDropZoneWrapper"
                    style={{ maxHeight: "68vh", overflowY: "auto" }}
                  >
                    {PassedDoc.filter((e) => e.PassedValidation === 1)
                      // .filter(
                      //   (
                      //     (s) => (o) =>
                      //       ((k) => !s.has(k) && s.add(k))(
                      //         ["ID", "DocTypeId"].map((k) => o[k]).join("|")
                      //       )
                      //   )(new Set())
                      // )
                      .map((item, index) => {
                        return (
                          <DropZone
                            typeId={item["DocTypeId"]}
                            label={item["ShortName"]}
                            handleSetFile={handleSetFile}
                            fnGetLeaderLineSetup={fnGetLeaderLineSetup}
                            {...item}
                            key={index}
                            setOriginalResJSON={setOriginalResJSON}
                            LoanId={LoanId || 0}
                            SessionId={SessionId || ""}
                            handleSetValuetoDD={handleSetValuetoDD}
                            setEnableSave={setEnableSave}
                            setConditionalModalOpen={setConditionalModalOpen}
                            setConditionDetails={setConditionDetails}
                            setScandocId={setScandocId}
                            setExtractResult={setExtractResult}
                            handleActivedropzone={handleActivedropzone}
                            activeDropzone={activeDropzone}
                            fnCheckConditionalRemainingModel={
                              fnCheckConditionalRemainingModel
                            }
                          />
                        );
                      })}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          }
        </div>
        <div
          className="col-xs-12 col-sm-12 col-md-6 col-lg-6 ContainerBorder"
          style={{ overflow: "auto" }}
          id="divImageColumn"
        >
          {
            /* Form fields for column 2 */
            <>
              {/* <h2>Image Column</h2> */}
              {Number(showTools) !== 0 && (
                <>
                  <ControlPanel
                    scale={scale}
                    setScale={setScale}
                    numPages={numPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    file={file}
                    rotate={rotation}
                    setrotation={setrotation}
                  />
                  <DropDown
                    label="Document Uploaded"
                    options={uploadedDocument
                      .filter(
                        (item) =>
                          item.ID === activeDropzone.Id &&
                          item.DocTypeId === activeDropzone.DocTypeId
                      )
                      .map((e) => {
                        e["FileName"] = e["FileName"].split(".")[0];
                        e["DateCreated_Merge"] = `${e["DateCreated"]} ${
                          e["EntityName"] ? " " + e["EntityName"] : ""
                        } ${e["UploadedBy"] ? " by " + e["UploadedBy"] : ""}`;
                        return e;
                      })}
                    style={{ width: "160px", display: "inline-block" }}
                    SelectSytle={{ padding: "0px", fontSize: "13px" }}
                    value="ScanDocId"
                    text="DateCreated_Merge"
                    name="UploadedDoc"
                    SelectedVal={UploadedDocValue}
                    onChange={(e) => {
                      let { value, name } = e.target;
                      handleDocumentUploadChange(value);
                      setDocChangeFlag(true);
                      setCondRemaining([]);
                      setValidationMsg("");

                      let UploadedMonthlyIncome = uploadedDocument.filter(
                        (item) => item.ScanDocId == value
                      );
                      // debugger;
                      setScandocId(value);
                      // let MonthlyIncomeDetails = `<b>Monthly Income Calculated:</b><br>${ResJSON["Name of Employer"]}   ${UploadedMonthlyIncome[0]?.MonthlyIncome} (${ResJSON["Which Borrower"]})<br><b>Total Monthly Income</b><br>${UploadedMonthlyIncome[0]?.MonthlyIncome}`;

                      // if (
                      //   document.getElementById("spnMonthlyIncomeMain") != null
                      // ) {
                      //   document.getElementById(
                      //     "spnMonthlyIncomeMain"
                      //   ).innerHTML = MonthlyIncomeDetails;
                      // }
                      // if (document.getElementById("spnMonthlyIncome") != null)
                      //   document.getElementById("spnMonthlyIncome").innerHTML =
                      //     UploadedMonthlyIncome[0]?.MonthlyIncome;
                      if (document.getElementById("spnRemainingCount") != null)
                        document.getElementById("spnRemainingCount").innerHTML =
                          UploadedMonthlyIncome[0]?.RemainingCount;
                    }}
                  />
                  {/* {uploadedDocDetails["UploadedBy"] !== "" && (
                    <InputBox
                      name="UploadedBy"
                      label="Uploaded By"
                      value={uploadedDocDetails["UploadedBy"] || ""}
                      style={{
                        width: "110px",
                        display: "inline-block",
                        marginLeft: "-1px",
                      }}
                      diabled={true}
                    />
                  )} */}
                  <DropDown
                    label="Use Document"
                    options={[
                      { value: "0", text: "No" },
                      { value: "1", text: "Yes" },
                    ]}
                    style={{ width: "100px", display: "inline-block" }}
                    SelectSytle={{ padding: "0px", fontSize: "12px" }}
                    value="value"
                    text="text"
                    name="UploadedDoc"
                    SelectedVal={
                      Number(uploadedDocDetails["UseDoc"]) === 2 ||
                      Number(uploadedDocDetails["UseDoc"]) === 3
                        ? "1"
                        : "0"
                    }
                    isIncludeSelect={false}
                    validationRequired={false}
                    onChange={(e) => {
                      let { value, name } = e.target;
                      // debugger;
                      setEnableSave(true);
                      setUploadedDocDetails({
                        ...uploadedDocDetails,
                        UseDoc: Number(value) === 1 ? 2 : 0,
                      });
                    }}
                  />
                </>
              )}

              {file !== null ? (
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  {/* <Page pageNumber={pageNumber} /> */}
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderAnnotationLayer={false}
                      scale={scale}
                      rotate={rotation}
                    ></Page>
                  ))}
                </Document>
              ) : (
                <div>No PDF file specified.</div>
              )}
            </>
          }
        </div>
        <div
          className="col-xs-12 col-sm-12 col-md-3 col-lg-3 ContainerBorder"
          id="divfieldsColumn"
        >
          {
            /* Form fields for column 3 */
            <div>
              <Tabs>
                <TabList>
                  <Tab>Fields</Tab>
                  <Tab>JSON</Tab>
                </TabList>
                <TabPanel style={{ overflow: "auto", height: "76vh" }}>
                  {Object.keys(ResJSON).length > 0 ? (
                    <>
                      <DropDown
                        label="Document Type"
                        options={DocType}
                        value="Id"
                        text="DocType"
                        name="DocType"
                        SelectedVal={DocTypeValue}
                        onChange={fnValueChange}
                      />
                      <TextBox
                        name="Name of Employer"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Employer Name"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                          // extractText();
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="2891"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                      />
                      <TextBox
                        name="Which Borrower"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Which Borrower"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="552"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Paid From Date"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Paid From Date"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="8377"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Paid To Date"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Paid To Date"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7648"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      {/* <TextBox
                        name="Pay Frequency"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Pay frequency"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7646"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      /> */}
                      <DropDown
                        label="Pay Frequency"
                        options={[
                          {
                            Id: "1",
                            Type: "Hourly Pay",
                          },
                          { Id: "2", Type: "Weekly Pay" },
                          { Id: "3", Type: "Bi-weekly Pay" },
                          { Id: "4", Type: "Monthly Pay" },
                          { Id: "5", Type: "Bi-monthly Pay" },
                          { Id: "6", Type: "Annual Pay" },
                          { Id: "7", Type: "VOE | Other" },
                        ]}
                        value="Id"
                        text="Type"
                        name="Pay Frequency"
                        SelectedVal={fnFrequencyValue(ResJSON["Pay Frequency"])}
                        onChange={fntxtChange}
                      />
                      <TextBox
                        name="Gross Pay"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. Gross Pay"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7645"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="YTD Earnings"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Paystub. YTD Earnings on paystub"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7647"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Hours Worked Per Week"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Hours Worked Per Week"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7794"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Employer Address"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Employer Street"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="3029"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Employer Zip Code"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Zip Code"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="3032"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Employer City"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="City"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="3030"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      <TextBox
                        name="Employer State"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="State"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="3031"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      />
                      {/* <TextBox
                        name="Country"
                        ResJSON={ResJSON}
                        onChange={fntxtChange}
                        label="Country"
                        onMouseHover={(e, value) => {
                          handleFindFormToElements(e, true, value);
                        }}
                        onMouseLeave={handleRemoveLine}
                        setChangeLogModalOpen={setChangeLogModalOpen}
                        LoanId={LoanId}
                        DbFieldId="7636"
                        ScanDocId={scandocId}
                        setChangeLogData={setChangeLogData}
                        GetAPIChangeLog={GetAPIChangeLog}
                      /> */}
                    </>
                  ) : ResJSON ? (
                    <>{ResJSON}</>
                  ) : ExtractResult.length > 0 ? (
                    ExtractResult
                  ) : (
                    <></>
                  )}
                  {Object.keys(ResJSON).length > 0 ? (
                    <div class="pagebottom">
                      <span class="footertext">Column Bottom</span>
                    </div>
                  ) : (
                    ""
                  )}
                </TabPanel>
                <TabPanel>
                  {Object.keys(ResJSON).length > 0 ? (
                    <div>
                      <pre>{OriginalResponsefromAPI || OriginalResJSON}</pre>
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
              <MenuOptions
                title="Menu"
                Options={[
                  {
                    title: "Feedback Change Log",
                    click: (e) => {
                      // window.open("www.google.com", "mozillaWindow", "popup");
                      // window.open(
                      //   <AgGrid />,
                      //   "",
                      //   "width=1200,height=1200,resizable=yes,scrollbars=yes"
                      // );
                      openNewWindow(`/AgGrid?LoanId=${LoanId}`);
                      // console.log("FeedBack");
                    },
                  },
                  {
                    title: "Save Form Size and Position",
                    click: () => {
                      const Jsonobj = {
                        Width: window.innerWidth,
                        Height: window.innerHeight,
                        CurrentView: 0,
                        Left: window.screenX,
                        Top: window.screenY,
                      };

                      const ViewJson = JSON.stringify(Jsonobj);

                      fnSaveWindowPosition(
                        SessionId,
                        ViewJson,
                        1,
                        0,
                        "/imagechecklistreact/index.html"
                      );

                      // console.log("Save Form Size and Position");
                    },
                  },
                ]}
              ></MenuOptions>
              {/* <div id="btnMenu" className="btn-group">
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
                      Copy text with proper sentence case{" "}
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
              </div> */}
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
                fnCheckBorrEntityExistsValidation();
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
      {modalOpen &&
        (Number(IsBorrExists) === 0 || Number(IsEntityExists) === 0) && (
          <Modal
            setOpenModal={setModalOpen}
            IsBorrExists={IsBorrExists}
            IsEntityExists={IsEntityExists}
            BorrLists={BorrLists}
            EntityLists={EntityLists}
            fnSaveFieldsToDW={fnSaveFieldsToDW}
            fnBorrEntityValueChange={fnBorrEntityValueChange}
            setWhichBorrower={setWhichBorrower}
            WhichBorrower={WhichBorrower}
            setWhichEnity={setWhichEnity}
            WhichEnity={WhichEnity}
            checkIcon={checkIcon}
            setcheckIcon={setcheckIcon}
            ShowError={ShowError}
            ResJSON={ResJSON}
          />
        )}
      {ConditionalRemainingModel && (
        <ConditionalRemainingCompleteModel
          setConditionalRemainingModel={setConditionalRemainingModel}
          CondRemaining={CondRemaining}
          ValidationMsg={ValidationMsg}
          uploadedDocDetails={uploadedDocDetails}
          CondCompleted={CondCompleted}
          conditionDetails={conditionDetails}
        ></ConditionalRemainingCompleteModel>
      )}
      {conditionalModalOpen && (
        <ConditionalModal
          setConditionalModalOpen={setConditionalModalOpen}
          conditionalModalOpen={conditionalModalOpen}
          conditionDetails={conditionDetails}
        ></ConditionalModal>
      )}
      {ChangeLogModalOpen && (
        <ChangeLog
          setChangeLogModalOpen={setChangeLogModalOpen}
          ChangeLogData={ChangeLogData}
        ></ChangeLog>
      )}
      <CustomizedSnackbars
        DocCheck={DocCheck}
        openMsg={openMsg}
        setOpenMsg={setOpenMsg}
        WhichProcessMsg={WhichProcessMsg}
      ></CustomizedSnackbars>
    </>
  );
}

export default Form;
