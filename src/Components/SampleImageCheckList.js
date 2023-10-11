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
import MultipleSelectCheckmarks from "./MultipleSelect";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomInputAutocomplete from "./DropDownWithTextBox";

import {
  handleAPI,
  TextBox,
  DropDown,
  Context,
  openNewWindow,
  fnSaveWindowPosition,
  DynamicTextBox,
} from "./CommonFunction";
import Modal from "../Components/Modal";
import LeaderLine from "leader-line";
import { pdfjs } from "react-pdf";
import ConditionalModal from "./ConditionModal";
import ControlPanel from "./PdfViewerTools";
import MenuOptions from "./MenuOption";

import CustomizedSnackbars from "./MessageComponents";
import ConditionalRemainingCompleteModel from "./ConditionRemainingCompleted";
import {
  CurrencyExchange,
  DeblurOutlined,
  Unarchive,
} from "@mui/icons-material";
import ChangeLog from "./ChangeLog";
import { grey } from "@mui/material/colors";

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
  const [ResJSON, setResJSON] = useState({});
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
  const [BorrowerList, setBorrowerList] = useState([]);

  const [TaskId, setTaskId] = useState("");
  const [ExtractResult, setExtractResult] = useState("");
  const [FieldExtractProgres, setFieldExtractProgres] = useState(false);

  const [ConditionalRemainingModel, setConditionalRemainingModel] =
    useState(false);

  const [conditionDetails, setConditionDetails] = useState(null);

  const [conditionalModalOpen, setConditionalModalOpen] = useState(false);
  const [isUploadDocChecked, setIsUploadDocChecked] = useState(false);
  const [uploadedDocDetails, setUploadedDocDetails] = useState({
    UploadedBy: "",
  });

  const [activeDropzone, setActiveDropzone] = useState({
    Id: 0,
    DocTypeId: 0,
    PreventScroll: false,
  });
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
  const [AssetTypeOPtions, setAssetTypeOPtions] = useState([]);

  const [AssetTypeOptionValue, setAssetTypeOptionValue] = React.useState([]);

  const [IncomeCalcProgres, setIncomeCalcProgres] = useState(false);
  const [confidenceScoreDetails, setConfidenceScoreDetails] = useState("");

  const options = {
    cMapUrl: "cmaps/",
    standardFontDataUrl: "standard_fonts/",
  };

  const [CondRemaining, setCondRemaining] = React.useState([]);
  const [ValidationMsg, setValidationMsg] = React.useState("");
  const [CondCompleted, setCondCompleted] = React.useState([]);
  const [DocDbFields, setDocDbFields] = React.useState([]);
  const [DocDbFieldsVOE, setDocDbFieldsVOE] = React.useState([]);
  const [OrgDocDbFields, setOrgDocDbFields] = React.useState([]);
  const [OrgDocTypeValue, setOrgDocTypeValue] = useState("0");

  const [FeedBackCollection, setFeedBackCollection] = useState(false);

  const [UpdateMappingonlyonNew, setUpdateMappingonlyonNew] = useState(false);

  const [MultipleProgressbar, setMultipleProgressbar] = useState([]);

  function fnCheckConditionalRemainingModel() {
    setConditionalRemainingModel(true);
  }

  const WhichBorrowerList = ({ fields, index }) => {
    debugger;

    // let iBorrowerList = BorrowerList,
    //   // .filter((item) => item.CustId > 0)
    //   CheckBorrExists = BorrowerList.filter(
    //     (item) => item.Name.trim() === fields.Value?.trim()
    //   ),
    //   iSelectVaue = "0";

    // if (CheckBorrExists.length === 0 && fields.Value?.trim() !== "") {
    //   iBorrowerList.push({
    //     CustId: -BorrowerList.length,
    //     Name: fields.Value?.trim(),
    //   });

    //   iSelectVaue = -BorrowerList.length;
    // } else if (CheckBorrExists.length > 0) {
    //   iSelectVaue = CheckBorrExists[0].CustId;
    // }

    return (
      <>
        <CustomInputAutocomplete
          label="Which Borrower"
          options={BorrowerList}
          value="CustId"
          text="Name"
          name="Which Borrower"
          SelectedVal={fields.Value || ""}
          isIncludeSelect={true}
          validationRequired={false}
          onChange={(e) => {
            debugger;
            let Name = e.currentTarget.textContent || e.target.textContent,
              DocDbFields_ = DocDbFields,
              CheckBorrExists = BorrowerList.filter(
                (item) => item.Name.trim() === Name?.trim()
              );
            if (CheckBorrExists.length > 0)
              DocDbFields_[index]["Value"] =
                CheckBorrExists[0]["CustId"] == 0 ? "" : Name;

            setDocDbFields([...[], ...DocDbFields_]);
            // debugger;
            setEnableSave(true);
          }}
        />
      </>
    );
  };

  const handleMultiSelect = (val) => {
    setAssetTypeOptionValue(val);
    setEnableSave(true);
    // console.log(val_);
  };

  function fnSaveOtherDBField(flag, _DocDbFields) {
    if (Number(DocTypeValue) === 43 && flag !== 1) {
      let DocDBField_ = DocDbFields.filter(
        (item) => item.DisplayName === "Which Borrower"
      );
      let Parsed_ = {};
      Parsed_["Which Borrower"] = DocDBField_[0].Value;
      Parsed_["Name of Employer"] = "";

      fnCheckBorrEntityExistsValidation(2, Parsed_);
      return;
    }
    setModalOpen(false);
    let DocDbFields__ = DocDbFields;
    if (flag === 1 && _DocDbFields !== undefined) DocDbFields__ = _DocDbFields;
    let val_ = AssetTypeOPtions.filter((item) => {
      return AssetTypeOptionValue.indexOf(item["TypeDesc"]) !== -1;
      // return val.indexOf(item["TypeDesc"]) !== -1;
    });
    val_ = val_.map((e) => e.TypeOption).join(",");

    let RespOrg = fnUpdateOriginalJSON();

    handleAPI({
      name: "SaveDBFieldFromAPI",
      params: {
        LoanId: LoanId,
        InputJSON: JSON.stringify(DocDbFields__)
          .replace("#", "")
          .replace("?", "")
          .replace("%", ""),
        AssetTypeOptions: val_ || [],
        ScandocId: scandocId,
        DocTypeId: DocTypeValue,
        OriginalJSON: RespOrg.replace(/undefined\//g, ""),
      },
    })
      .then((response) => {
        console.log(response);
        console.log(activeDropzone);
        handleFooterMsg("Saved Successfully.");
        setEnableSave(false);
        fnSendFeedbacktoAPI(DocDbFields__);

        fnRunImageValidation(1);

        // let UpdateUploadedDoc = DocDetails;

        // UpdateUploadedDoc.forEach((item) => {
        //   if (Number(item.ScanDocId) === Number(scandocId))
        //     item.DocTypeId = DocTypeValue;
        // });

        // setDocDetails([...[], ...UpdateUploadedDoc]);

        // if (Number(activeDropzone.DocTypeId) !== Number(DocTypeValue)) {
        //   let FilterDoc = DocDetails.filter(
        //     (item) =>
        //       Number(item.DocTypeId) === Number(DocTypeValue) &&
        //       Number(item.ScanDocId) !== 0
        //   );
        //   //  console.log(FilterDoc);
        //   if (FilterDoc.length > 0) {
        //     // fnPageload(LoanId, userId, userType, 1, FilterDoc[0].DocTypeId);
        //     setTimeout(() => {
        //       handleActivedropzone(
        //         {
        //           ...activeDropzone,
        //           ...{ Id: FilterDoc[0].ID, DocTypeId: DocTypeValue },
        //         },
        //         1
        //       );
        //     }, 2000);
        //   }
        // }

        // response = JSON.parse(response);
        // console.log(response);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
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
        let ResultJSON = JSON.parse(dataarray[1]).ValidationMessages;
        let CompletedJSON = JSON.parse(dataarray[2]).CompletedMessages;

        if (flag === 1) {
          fnPageload(LoanId, userId, userType);
          if (ResultJSON.length === 0 && CompletedJSON.length !== 0) {
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

        // if (dataarray[0] == "1") {
        if (ResultJSON.length === 0) {
          validationmsg = "This Document Passes Validation";
          // console.log(uploadedDocDetails.PassedValidation);
          setUploadedDocDetails({ ...uploadedDocDetails, PassedValidation: 1 });
          setValidationMsg(validationmsg);
          setCondRemaining([]);
          setCondCompleted(CompletedJSON);
        } else {
          validationmsg = "Document Refer Reasons";
          setValidationMsg(validationmsg);
          setUploadedDocDetails({ ...uploadedDocDetails, PassedValidation: 0 });
          // debugger;
          setCondRemaining(ResultJSON);
          setCondCompleted(CompletedJSON);
        }
        // else if (dataarray[0] == "-98") {
        //   validationmsg =
        //     "Image Data is not availabe for Validation, please update and run again.";

        //   setValidationMsg(validationmsg);
        //   setCondRemaining([]);
        //   setCondCompleted([]);
        // } else if (dataarray[0] == "-90") {
        //   validationmsg =
        //     "Image Validation Failed. Please try again or contact support.";

        //   setValidationMsg(validationmsg);
        //   setCondRemaining([]);
        //   setCondCompleted([]);
        // } else {
        //   validationmsg =
        //     "There Are No Validation Rules For This Document Type.";

        //   setValidationMsg(validationmsg);
        //   setCondRemaining([]);
        //   setCondCompleted([]);
        // }
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

  const formatCurrency = (value) => {
    if (value == "" || value == "$" || value == undefined) return "";
    let num = value.toString().replace("$", "").replace(",", ""),
      numParts = num.split("."),
      dollars = numParts[0],
      cents = numParts[1] || "",
      sign = num == (num = Math.abs(num));

    dollars = dollars.replace(/\$|\,/g, "");

    if (isNaN(dollars)) dollars = "0";

    dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return "$" + ((sign ? "" : "-") + dollars + (cents ? "." + cents : ""));
  };

  // const formatCurrency = (value, decPlaces) => {
  //   let num = value.toString().replace("$", "").replace(",", ""),
  //     multiplier = Math.pow(10, decPlaces),
  //     rounder = 50 / multiplier + 0.00000000001,
  //     i = 0,
  //     cents = num % multiplier,
  //     sign = num == (num = Math.abs(num));

  //   num = num.toString().replace(/\$|\,/g, "");

  //   if (isNaN(num)) num = "0";

  //   if (isNaN(decPlaces)) num = "2";

  //   num = Math.floor(num * multiplier + rounder);

  //   num = Math.floor(num / multiplier).toString();

  //   for (i = 1; i < decPlaces; i++) {
  //     if (cents < Math.pow(10, i)) cents = "0" + cents;
  //   }

  //   for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
  //     num =
  //       num.substring(0, num.length - (4 * i + 3)) +
  //       "," +
  //       num.substring(num.length - (4 * i + 3));

  //   return "$" + ((sign ? "" : "-") + num);
  // };

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

      // if (eleTo.length == 0) {
      //   eleTo = PdfEle.filter(
      //     (ele) =>
      //       ele.textContent
      //         .toString()
      //         .replaceAll("$", "")
      //         .toLowerCase()
      //         .indexOf(value.toString().replaceAll("$", "").toLowerCase()) > -1
      //   );
      // }

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
        console.log("eleFrom =" + eleFrom + "eleTo =" + eleTo);
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
    if (value !== DocTypeValue) setFeedBackCollection(false);

    setDocTypeValue(value);
    setEnableSave(true);
    // setCategory(catType);
    // setEntityTypeId(entityType);
    setDescription(e.target.selectedOptions[0].text);
    if (value !== 169) fnGetDocTypeDBField(value);
    // document.getElementById("spnResubmitdiv").style.display = "inline-block";
    // setBorrowerList(BorrowerList.filter((item) => item.CustId > 0));
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
        let ParsedJson;
        if (OriginalResJSON.indexOf("extraction_json") > -1)
          ParsedJson = JSON.parse(OriginalResJSON)["extraction_json"] ?? {};
        //ParsedJson = JSON.parse(OriginalResJSON)["business_logic_json"];
        else ParsedJson = JSON.parse(OriginalResJSON);
        fnGetLeaderLineSetup(ParsedJson);
        handleSetValuetoDD(JSON.parse(OriginalResJSON)["doc_type"]);
      }
      setUpdateMappingonlyonNew(true);
    }, 1000);
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
    let div = document.querySelector("#divDropZoneWrapper"),
      divBody = document.querySelectorAll(".ContainerBorder");

    if (divBody.length > 0) {
      let windowHeight = window.innerHeight,
        headerHeight = document.querySelector(".headergradient").offsetHeight,
        footerHeight = document.querySelector(".navbar").offsetHeight,
        newBodyHeight = windowHeight - (headerHeight + footerHeight);

      divBody.forEach((div) => {
        div.style.minHeight = newBodyHeight - 25 + "px";
      });
    }
    if (div) {
      let height = document.querySelector(".react-tabs__tab-list").offsetHeight,
        tHeight = document.querySelector(".ContainerBorder").offsetHeight,
        fDropZone = document.querySelector(".divMaindropZone").offsetHeight;
      div.style.maxHeight = tHeight - fDropZone - height - 25 + "px";
    }
  };

  function fnPageload(
    iLoanId,
    iUserId,
    iUserType,
    flag,
    UploadedDocTypeId,
    iScanDocIds
  ) {
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
        // debugger;
        let docDec = JSON.parse(response["Table"][0].Column1)[0] || [];
        if (response["Table"][0].Column2 === "")
          response["Table"][0].Column2 = "[]";

        let AssetOption1 = JSON.parse(response.Table2[0].Result).filter(
          (item) =>
            Number(item.TypeOption) === 1 || Number(item.TypeOption) === 2
        );
        let AssetOption2 = JSON.parse(response.Table2[0].Result).filter(
          (item) =>
            Number(item.TypeOption) !== 1 && Number(item.TypeOption) !== 2
        );

        let AssetOption = [...AssetOption1, ...AssetOption2];
        setAssetTypeOPtions(AssetOption);

        let UploadedDocFiles = JSON.parse(response["Table"][0].Column2) || [];
        UploadedDocFiles = UploadedDocFiles.filter(
          (item) => item.IsFromDocUploadForm === "1"
        );
        let totalArr = JSON.parse(response["Table1"][0].Result) || [],
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

        docDec = docDec.filter((item) => Number(item.ScandocId) !== 0);

        docDec = [...docDec, ...resultArr];

        let BorrowerList = JSON.parse(response["Table3"][0].BorrowerList) || [];

        setBorrowerList(BorrowerList);

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

        // const mergedArray = UploadedDocFiles.map((item, index) => {
        //   // Find the corresponding item in array2 based on the id
        //   const matchingItem = resultArr.find(
        //     (el) => Number(el.ScanDocId) === Number(item.ScanDocId)
        //   );

        //   // Add the age property to the item from array1

        //   return {
        //     ...item,
        //     ...{
        //       Confident_Score: matchingItem.Confident_Score,
        //       Task_Id: matchingItem.Task_Id,
        //     },
        //   };
        // });

        // console.log(mergedArray);
        docDec.sort((a, b) => a.ShortName?.localeCompare(b.ShortName));
        // debugger;
        setDocDetails(docDec);

        setUploadedDocument(UploadedDocFiles);

        //  console.log("resultArr[0]", resultArr[0]);

        setDocChangeFlag(false);

        let UploadedMonthlyIncome = UploadedDocFiles.filter(
          (item) => Number(item.DocTypeId) === Number(169)
        );

        setTimeout(() => {
          if (document.getElementById("spnMonthlyIncomeMain") != null) {
            document.getElementById("spnMonthlyIncomeMain").innerHTML =
              UploadedMonthlyIncome[0]?.IncomeDetails || "";
          }
        }, 500);

        setIncomeCalcProgres(false);
        //Commented below lines to Pick the uploaded doc faster
        // setTimeout(() => {
        if (flag === 1) {
          let FilterDoc = docDec.filter(
            (item) => Number(item.DocTypeId) === Number(UploadedDocTypeId)
          );
          //  console.log(FilterDoc);
          if (FilterDoc.length > 0) {
            handleActivedropzone(
              {
                ...activeDropzone,
                ...{ Id: FilterDoc[0].ID, DocTypeId: FilterDoc[0].DocTypeId },
              },
              flag,
              UploadedDocFiles
            );
          }
        }

        if (!DocChangeFlag || flag === 1) {
          // alert("Here");
          // alert(resultArr[0]["ScanDocId"]);
          setUploadedDocValue(iScanDocIds);
          // if (resultArr.length > 0)
          //   setUploadedDocValue(resultArr[0]["ScanDocId"]);
        }
        // }, 500);
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
  }, []);

  function fnUpdateDocdeatails(ResDoc) {
    setDocDetails([...ResDoc, ...DocDetails]);

    setUploadedDocument([...ResDoc, ...uploadedDocument]);
  }

  function fnGetImagefromServer(ScandocId) {
    handleAPI({
      name: "GetUploadedImageWithJSON",
      params: { ScandocId: ScandocId, ViewType: 0, SessionId: SessionId },
    })
      .then((response) => {
        let PdfPath = `https://www.directcorp.com/PDF/${
          response.split("~")[0]
        }`;
        let Json = response.split("~")[1];
        setFile(PdfPath);
        // if (Json instanceof String)

        // if (response.split("~")[2]?.trim() ?? "") {
        // setOriginalResponsefromAPI(response.split("~")[2]);

        setOriginalResponsefromAPI(Json);
        // } else {
        //   setOriginalResponsefromAPI(null);
        if (Json.toString().indexOf("{") === -1) setResJSON({});
        // }

        if (
          Json.toString().indexOf("status code") === -1 &&
          Json.toString().indexOf("Error") === -1
        )
          setOriginalResJSON(
            Json.replace(
              "VOE line 12 B. Commission Income. ",
              "VOE line 12 B. Commission Income."
            )
          );
        else setOriginalResJSON("");

        // setTimeout(() => {
        // setUpdateMappingonlyonNew(true);
        // }, 500);

        // else setOriginalResJSON(Json);

        // console.log(PdfPath);
        // console.log(Json);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }

  const handleSetValuetoDD = (
    docType,
    OrgDocId,
    iScanDocIds,
    Confident_Score,
    flagg,
    UpdatedDocDet
  ) => {
    let docType_ = docType;
    if (!docType) docType = "miscellaneous";
    if (Confident_Score === undefined) Confident_Score = "";
    if (OrgDocId === undefined) return;
    let UploadedDocTypeId = 0;
    if (iScanDocIds !== undefined) setUpdateMappingonlyonNew(true);

    if (docType !== undefined && DocType !== "") {
      let Filterdoctype = DocType.filter((items) => {
        return (
          items.DocType.toString().replaceAll(" ", "").toLowerCase() ===
          docType.toLowerCase()
        );
      });

      if (Filterdoctype.length === 0) {
        Filterdoctype = DocType.filter((items) => {
          return (
            items.DocType.toString().replaceAll(" ", "").toLowerCase() ===
            "miscellaneous"
          );
        });
      }

      if (Filterdoctype.length > 0) {
        setDocTypeValue(Filterdoctype[0].Id);
        // setOrgDocTypeValue(Filterdoctype[0].Id);
        // debugger;
        if (DocTypeValue !== 169)
          fnGetDocTypeDBField(Filterdoctype[0].Id, iScanDocIds || scandocId, 1);
        setCategory(Filterdoctype[0].CategoryType);
        setEntityTypeId(Filterdoctype[0].iEntityType);
        setDescription(Filterdoctype[0].DocType);
        if (OrgDocId && Filterdoctype[0].Id !== OrgDocId) {
          setWhichProcessMsg(0);
          // setOpenMsg(true);
          setDocCheck(Filterdoctype[0].DocType);
          debugger;
          // console.log(activeDropzone);
          UploadedDocTypeId = Filterdoctype[0].Id;
        }

        let FilterDoc;
        if (flagg === 1) {
          if (MultipleProgressbar.length > 0) {
            let iiFilterDoc = DocType.filter(
              (item) => item.Id === Number(DocTypeValue)
            );
            if (Number(UpdatedDocDet[0].ScanDocId) === scandocId) {
              UpdatedDocDet[0].DocTypeId = Number(DocTypeValue);
              UpdatedDocDet[0].ShortName = iiFilterDoc[0].DocType;
              UpdatedDocDet[0].Descript = iiFilterDoc[0].DocType;
              UpdatedDocDet[0].Classified_Doctype = iiFilterDoc[0].DocType;
              UpdatedDocDet[0].DocName = iiFilterDoc[0].DocType;
            }
          }

          FilterDoc = UpdatedDocDet;
        } else {
          FilterDoc = DocDetails.filter(
            (item) => Number(item.DocTypeId) === Number(UploadedDocTypeId)
          );
        }
        //  console.log(FilterDoc);
        if (FilterDoc.length > 0) {
          if (Number(FilterDoc[0].DocTypeId) === Number(169))
            setIncomeCalcProgres(true);
          handleActivedropzone(
            {
              ...activeDropzone,
              ...{ Id: FilterDoc[0].ID, DocTypeId: FilterDoc[0].DocTypeId },
            },
            1,
            FilterDoc
          );

          let containsNumber = /\d/.test(Confident_Score);
          let percentageValue = Confident_Score;
          if (containsNumber)
            percentageValue = (Confident_Score * 100).toFixed(0) + "%";

          if (document.querySelector("#spnConfidenceScore") !== null)
            document.querySelector("#spnConfidenceScore").innerHTML =
              "<label>Confidence Score : </label>" + " " + percentageValue ||
              "" + " | " + "<label>DocType : </label>" + " " + docType_ ||
              "null";

          // setConfidenceScoreDetails(
          //   document.querySelector("#spnConfidenceScore").innerHTML
          // );
        }
      }
    }
    // fnPageload(LoanId, userId, userType, 1, UploadedDocTypeId, iScanDocIds);
  };

  function fnGetLeaderLineSetup(obj) {
    // debugger;

    if (obj || obj !== {}) {
      setResJSON(obj);
      let ele = [],
        PdfEle = Array.from(document.querySelectorAll(".textLayer span")),
        KeyValues = Object.values(obj).map((val) => {
          if (val !== null) val.toString().replaceAll("$", "").toLowerCase();
        });

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
      setResJSON({});
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
          Descript: "Test",
          Category: 1,
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

  function fnCheckFeedbackJSON(docType, DocDbFields__) {
    let validateJSON = true;

    if (Number(docType) !== Number(169)) {
      if (JSON.stringify(OrgDocDbFields) === JSON.stringify(DocDbFields))
        validateJSON = false;

      setOrgDocDbFields(structuredClone(DocDbFields));
      // if (DocDbFields__ !== undefined && DocDbFields__ !== "") {
      //   if (JSON.stringify(OrgDocDbFields) === JSON.stringify(DocDbFields__))
      //     validateJSON = false;
      // }
    } else {
      let ParsedJson = OriginalResJSON;
      if (OriginalResJSON.indexOf("extraction_json") > -1)
        ParsedJson = JSON.parse(OriginalResJSON)["extraction_json"] ?? {};
      else ParsedJson = JSON.parse(OriginalResJSON);
      if (JSON.stringify(ParsedJson) === JSON.stringify(ResJSON))
        validateJSON = false;
    }

    if (Number(OrgDocTypeValue) !== Number(docType)) validateJSON = true;

    return validateJSON;
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

  function fnCheckBorrEntityExistsValidation(flag, ParsedJson) {
    // debugger;
    let FilterJSON = {},
      IsCheckValidated = 0;
    if (flag === 1 || flag === 2) FilterJSON = JSON.stringify(ParsedJson);
    else FilterJSON = JSON.stringify(ResJSON);

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

        if (flag === 2) {
          if (Number(BorrExists) === 1) {
            IsCheckValidated = 1;
            fnSaveOtherDBField(1);
            return;
          } else IsCheckValidated = 0;
          EntityExists = 1;
        }

        if (Number(BorrExists) === 1 && Number(EntityExists) === 1) {
          if (flag !== 2) fnSaveFieldsToDW();
        } else {
          setIsBorrExists(BorrExists);
          setIsEntityExists(EntityExists);
          setBorrLists(BorrLists);
          setEntityLists(EntityLists);
          setModalOpen(true);
        }
        setEnableSave(false);
        return IsCheckValidated;
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

  const formatDateTimeNew = (date) => {
    if (date === "" || date === undefined) return "";

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear().toString();

    let [month, day, year] = date.split("/");

    if (!day) {
      day = month;

      month = currentDate.getMonth() + 1;
    }

    const parsedMonth = parseInt(month);

    const parsedDay = parseInt(day);

    const isValidMonth =
      !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12;

    const isValidDay = !isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31;

    if (!isValidMonth || !isValidDay) {
      const formattedCurrentMonth = (currentDate.getMonth() + 1)

        .toString()

        .padStart(2, "0");

      const formattedCurrentDay = currentDate

        .getDate()

        .toString()

        .padStart(2, "0");

      return `${formattedCurrentMonth}/${formattedCurrentDay}/${currentYear}`;
    }

    if (year && year.length === 2) {
      year = currentYear.slice(0, 2) + year;
    } else if (!year) {
      year = currentYear;
    }

    const formattedMonth = parsedMonth.toString().padStart(2, "0");

    const formattedDay = parsedDay.toString().padStart(2, "0");

    return `${formattedMonth}/${formattedDay}/${year}`;
  };

  function handleActivedropzone(activeDropzone, flag, iuploadedDocument) {
    debugger;
    if (flag === 1) activeDropzone.PreventScroll = true;
    else {
      activeDropzone.PreventScroll = false;
      setFeedBackCollection(false);
    }
    setActiveDropzone(activeDropzone);
    let activeScandocId = uploadedDocument.filter(
      (item) =>
        item.ID === activeDropzone.Id &&
        item.DocTypeId === activeDropzone.DocTypeId
    );

    if (flag === 1 && iuploadedDocument !== undefined) {
      activeScandocId = iuploadedDocument.filter(
        (item) =>
          item.ID === activeDropzone.Id &&
          item.DocTypeId === activeDropzone.DocTypeId
      );
    }

    // console.log(activeScandocId);
    // debugger;
    if (activeScandocId.length > 0) {
      activeScandocId = activeScandocId[0].ScanDocId || 0;
      if (activeScandocId != 0)
        handleDocumentUploadChange(activeScandocId, flag, iuploadedDocument);
      setShowTools(1);

      let UploadedMonthlyIncome = uploadedDocument.filter(
        (item) => item.ScanDocId == activeScandocId
      );
      if (flag === 1 && iuploadedDocument !== undefined) {
        UploadedMonthlyIncome = iuploadedDocument.filter(
          (item) => item.ScanDocId == activeScandocId
        );
      }
      setScandocId(activeScandocId);
      console.log(ResJSON);

      if (activeDropzone.DocTypeId === 169)
        if (document.getElementById("spnMonthlyIncomeMain") != null) {
          document.getElementById("spnMonthlyIncomeMain").innerHTML =
            UploadedMonthlyIncome[0]?.IncomeDetails || "";
        }
      setIncomeCalcProgres(false);
      setTimeout(() => {
        UploadedMonthlyIncome = uploadedDocument.filter(
          (item) => item.ScanDocId == activeScandocId
        );

        if (flag === 1 && iuploadedDocument !== undefined) {
          UploadedMonthlyIncome = iuploadedDocument.filter(
            (item) => item.ScanDocId == activeScandocId
          );
        }
        // if (
        //   UploadedMonthlyIncome[0].Confident_Score !== undefined &&
        //   UploadedMonthlyIncome[0].Confident_Score !== ""
        // ) {
        if (UploadedMonthlyIncome[0].Confident_Score === 0)
          UploadedMonthlyIncome[0].Confident_Score = "";

        let containsNumber = /\d/.test(
          UploadedMonthlyIncome[0].Confident_Score
        );
        let percentageValue = UploadedMonthlyIncome[0].Confident_Score;
        if (containsNumber)
          percentageValue =
            (UploadedMonthlyIncome[0].Confident_Score * 100).toFixed(0) + "%";

        if (document.querySelector("#spnConfidenceScore") !== null)
          document.querySelector("#spnConfidenceScore").innerHTML =
            "<label>Confidence Score : </label> " +
            " " +
            percentageValue +
            " | " +
            "<label>DocType : </label>" +
            " " +
            UploadedMonthlyIncome[0].Classified_Doctype;
        // }
      }, 1000);

      setDocTypeValue(activeDropzone.DocTypeId);
      setOrgDocTypeValue(activeDropzone.DocTypeId);
      if (activeDropzone.DocTypeId !== 169)
        fnGetDocTypeDBField(activeDropzone.DocTypeId, activeScandocId);
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
      setOriginalResJSON("");
      // uploadedDocDetails["ScanDocId"] = "";
      // uploadedDocDetails.PassedValidation = 0;
    }
  }
  useEffect(() => {
    console.log("ResJSON", ResJSON);
  }, [ResJSON]);

  useEffect(() => {
    // console.log("ResJSON", ResJSON);
    if (UpdateMappingonlyonNew) {
      // setTimeout(() => {
      fnMapExtractionJsonField(DocTypeValue);
      setUpdateMappingonlyonNew(false);
    }
    // }, 500);
  }, [UpdateMappingonlyonNew]);

  useEffect(() => {
    // console.log("ResJSON", ResJSON);
    if (UpdateMappingonlyonNew) {
      // setTimeout(() => {
      fnMapExtractionJsonField(DocTypeValue);
      setUpdateMappingonlyonNew(false);
    }
    // }, 500);
  }, [OriginalResJSON, DocDbFields]);
  // useEffect(() => {
  //   console.log("DocTypeValue", DocTypeValue);
  //   fnMapExtractionJsonField(DocTypeValue);
  // }, [OriginalResJSON]);

  const handleDocumentUploadChange = (value, flag, iuploadedDocument) => {
    // if (
    //   value == 0 &&
    //   document.querySelector(".react-tabs__tab.react-tabs__tab--selected")
    //     .innerText === "Documents Uploaded"
    // ) {
    //   document.getElementById("spnMonthlyIncomeMain").innerHTML = "";
    // }
    if (value === undefined) value = UploadedDocValue;
    // console.log("value =", value);

    if (flag !== 1) setUploadedDocValue(value);
    fnGetImagefromServer(value);
    let isChecked = "0",
      checkedIndex = uploadedDocument.filter(
        (e) => Number(e["ScanDocId"]) === Number(value)
      );

    if (checkedIndex.length === 0 && iuploadedDocument !== undefined) {
      checkedIndex = iuploadedDocument.filter(
        (e) => Number(e["ScanDocId"]) === Number(value)
      );
    }
    if (checkedIndex && Number(value) !== 0) {
      checkedIndex = checkedIndex[0];
      if (
        Number(checkedIndex["UseDoc"]) === 2 ||
        Number(checkedIndex["UseDoc"]) === 3
      ) {
        isChecked = "1";
      }
    }
    // if (
    //   checkedIndex.Confident_Score !== undefined &&
    //   checkedIndex.Confident_Score !== ""
    // ) {
    if (checkedIndex.Confident_Score === 0) checkedIndex.Confident_Score = "";
    setTimeout(() => {
      let containsNumber = /\d/.test(checkedIndex.Confident_Score);
      let percentageValue = checkedIndex.Confident_Score;
      if (containsNumber)
        percentageValue = (checkedIndex.Confident_Score * 100).toFixed(0) + "%";

      if (document.querySelector("#spnConfidenceScore") !== null)
        document.querySelector("#spnConfidenceScore").innerHTML =
          "<label>Confidence Score : </label>" +
          " " +
          percentageValue +
          " | " +
          "<label>DocType : </label>" +
          " " +
          checkedIndex.Classified_Doctype;
    }, 500);
    // }
    // setIsUploadDocChecked(isChecked);
    setUploadedDocDetails(checkedIndex);
  };

  function fndataformat(dateStr) {
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }

  function trimObjectKeys(obj) {
    const trimmedObject = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const trimmedKey = key.trim();
        trimmedObject[trimmedKey] = obj[key];
      }
    }
    return trimmedObject;
  }

  function fnGetDocTypeDBField(value, iScanDocId, flag) {
    let ParsedJson_ = {};
    if (OriginalResJSON !== "")
      ParsedJson_ = JSON.parse(OriginalResJSON)["extraction_json"];
    if (Number(value) !== Number(169) || ParsedJson_ === null) {
      setResJSON({});

      handleAPI({
        name: "GetDocTypeDbField",
        params: {
          DocTypeId: value,
          LoanId: LoanId,
          ScandocId: scandocId || iScanDocId,
        },
      })
        .then((response) => {
          console.log(response);
          debugger;
          let DocDbFields_ =
            JSON.parse(JSON.parse(response).Table[0].Column1) !== null
              ? JSON.parse(JSON.parse(response).Table[0].Column1)
              : [];

          let DocDbFields__ =
            JSON.parse(JSON.parse(response).Table[0].Column1) !== null
              ? JSON.parse(JSON.parse(response).Table[0].Column1)
              : [];
          // setDocDbFields([...DocDbFields, ...DocDbFields_]);
          setDocDbFields(DocDbFields_);

          // if (DocTypeValue == 23)
          //   setDocDbFieldsVOE(
          //     JSON.parse(JSON.stringify([...DocDbFields_, ...DocDbFields_]))
          //   );

          setOrgDocDbFields(DocDbFields__);
          if (DocDbFields_.length > 0) {
            let arr = DocDbFields_.filter(
              (item) => item.DisplayName === "Type of Account"
            );
            if (arr.length > 0)
              setAssetTypeOptionValue(arr[0].Value.split(", "));
            setUpdateMappingonlyonNew(!UpdateMappingonlyonNew);
            // setTimeout(() => {
            // fnMapExtractionJsonField(value);
            // }, 4000);
          }

          // setModalOpen(true);
        })
        .catch((error) => {
          //debugger;
          console.log("error", error);
        });
    }
    if (Number(value) === Number(169) && flag !== 1) {
      debugger;
      setDocDbFields([]);
      setOrgDocDbFields([]);
      if (OriginalResJSON !== "") {
        let ParsedJson = JSON.parse(OriginalResJSON)["extraction_json"] ?? {};
        // setResJSON({ ...{}, ...ParsedJson });
        setResJSON(ParsedJson);
        setDocTypeValue(169);
      }

      // fnGetLeaderLineSetup(ParsedJson);
      // setDocDbFields([]);
      // return;
    }
  }

  const FormatPhone = (PhoneNo) => {

    if (PhoneNo != "" && PhoneNo != undefined) {  
      if (PhoneNo.indexOf("@") == -1) PhoneNo = PhoneNo.replaceAll("-", "");  
      PhoneNo = PhoneNo.replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "");
  
      if (PhoneNo.indexOf("@") == -1 && Number(PhoneNo) && PhoneNo.length === 10) {  
        PhoneNo = PhoneNo.replace(/D/g, "");  
        if (PhoneNo.length < 10) {  
          return PhoneNo; 
        }  
  
        let p = /^([\d]{3})([\d]{3})([\d]{4,})$/.exec(PhoneNo);  
        PhoneNo = "(" + p[1] + ") " + p[2] + "-" + p[3];  
        return PhoneNo;  
      }  
    }  
    return PhoneNo;  
  };

  function fnFrequencyValue(FreqValue) {
    if (!isNaN(FreqValue) || FreqValue === undefined) return FreqValue;
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

  function convertToFourDigitYear(dateStr) {
    const datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{2})$/;
    const matchArray = dateStr.match(datePat);

    if (matchArray === null) {
      return dateStr; // Return the original string if it doesn't match the expected format
    }

    const month = matchArray[1];
    const day = matchArray[3];
    let year = matchArray[5];
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;

    year = parseInt(year, 10);
    year += year < currentYear % 100 ? currentCentury : currentCentury - 100;

    return `${month}/${day}/${year}`;
  }

  // async function convertUrlToFile(url, FileName) {
  //   return fetch(url)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       // Create a new File object from the Blob
  //       const file = new File([blob], FileName, { type: "application/pdf" });
  //       return file;
  //     });
  // }

  function fnMapExtractionJsonField(doctypeId) {
    if (OriginalResJSON) {
      let ParsedJson;
      if (OriginalResJSON.indexOf("extraction_json") > -1)
        ParsedJson = JSON.parse(OriginalResJSON)["extraction_json"] ?? {};
      if (ParsedJson !== undefined) {
        if (
          ParsedJson.financial_institution !== undefined &&
          Number(doctypeId) === Number(43)
        ) {
          console.log(ParsedJson);
          DocDbFields.forEach((item) => {
            if (Number(item.Dbfieldid) === Number(3058))
              item.Value = ParsedJson.financial_institution || "";
            
            if (Number(item.Dbfieldid) === Number(4652))
              item.Value = FormatPhone(ParsedJson["Agent Phone"]) || "";
              

            if (Number(item.Dbfieldid) === Number(8386))
              item.Value =
                fndataformat(ParsedJson.beginning_date).replace(
                  /undefined\//g,
                  ""
                ) || "";

            if (Number(item.Dbfieldid) === Number(8387))
              item.Value =
                fndataformat(ParsedJson.ending_date).replace(
                  /undefined\//g,
                  ""
                ) || "";

            if (Number(item.Dbfieldid) === Number(3052))
              item.Value = ParsedJson.account_holder[0] || "";

            if (Number(item.Dbfieldid) === Number(3061))
              item.Value = ParsedJson.account_number[0] || "";

            // if (
            //   Number(item.Dbfieldid) === Number(3062) &&
            //   ParsedJson.current_balance[0] !== undefined
            // )
            //   item.Value = ParsedJson.current_balance[0] || "";

            if (
              Number(item.Dbfieldid) === Number(3062) &&
              ParsedJson?.account !== "" &&
              ParsedJson?.account !== undefined
            ) {
              // item.Value = ParsedJson.current_balance[0] || "";
              let CurrentBalChk = 0,
                CurrentBalSav = 0,
                CurrentBalReg = 0;
              ParsedJson.account.forEach((element) => {
                if (element.type === "Checking")
                  CurrentBalChk = element.current_balance
                    .replace("$", "")
                    .replace(",", "");

                if (element.type === "Saving")
                  CurrentBalSav = element.current_balance
                    .replace("$", "")
                    .replace(",", "");

                if (element.type === "Regular")
                  CurrentBalReg = element.current_balance
                    .replace("$", "")
                    .replace(",", "");

                item.Value = formatCurrency(
                  CurrentBalChk + CurrentBalSav + CurrentBalReg
                );
              });
            }

            if (Number(item.Dbfieldid) === Number(8388))
              item.Value =
                ParsedJson.qualifying_balance[0] ||
                ParsedJson.qualifying_balance ||
                "";
            if (
              Number(item.Dbfieldid) === Number(3059) &&
              ParsedJson?.account_type !== "" &&
              ParsedJson?.account_type !== undefined
            ) {
              const typeAcc = ParsedJson?.account_type?.join(", ");
              // item.Value = [typeAcc];

              // setAssetTypeOptionValue(typeAcc);

              setAssetTypeOptionValue(typeAcc.split(", "));
              console.log(typeAcc);
            }

            if (
              Number(item.Dbfieldid) === Number(3059) &&
              ParsedJson?.account !== "" &&
              ParsedJson?.account !== undefined
            ) {
              let typeAcc;
              // const typeAcc = ParsedJson?.account?.join(", ");
              ParsedJson.account.forEach((element) => {
                typeAcc = element.type + ", ";
                console.log(element);
              });

              // item.Value = [typeAcc];

              // setAssetTypeOptionValue(typeAcc);

              setAssetTypeOptionValue(typeAcc.split(", "));
              console.log(typeAcc);
            }
          });

          setDocDbFields(DocDbFields);
          // if (DocTypeValue == 23)
          //   setDocDbFieldsVOE(
          //     JSON.parse(JSON.stringify([...DocDbFields, ...DocDbFields]))
          //   );

          setUpdateMappingonlyonNew(false);
          setOrgDocDbFields(structuredClone(DocDbFields));
        } else if (Number(doctypeId) === Number(23)) {
          console.log(ParsedJson);
          
          if(ParsedJson.length){
          DocDbFields.forEach((item) => {
            if (Number(item.Dbfieldid) === Number(7652))
              item.Value =
                formatCurrency(ParsedJson[0]["VOE line 12 B Base Pay."]) || "";

            if (Number(item.Dbfieldid) === Number(7655))
              item.Value =
                formatCurrency(ParsedJson[0]["VOE line 12 B. Overtime Income."]) ||
                "";

            if (Number(item.Dbfieldid) === Number(7656))
              item.Value =
                formatCurrency(
                  ParsedJson[0]["VOE line 12 B. Commission Income."]
                ) || "";

            if (Number(item.Dbfieldid) === Number(7657))
              item.Value =
                formatCurrency(ParsedJson[0]["VOE line 12 B. Bonus Income."]) ||
                "";

                if (Number(item.Dbfieldid) === Number(8407))
                item.Value =
                  formatCurrency(ParsedJson[0]["Last Pay Increase Amount"]) ||
                  "";

                  if (Number(item.Dbfieldid) === Number(8406))
                  item.Value =
                  formatDateTimeNew(ParsedJson[0]["Last Pay Increase Date"]) ||
                    "";

                    if (Number(item.Dbfieldid) === Number(8405))
                item.Value =
                  formatCurrency(ParsedJson[0]["Next Pay Increase Amount"]) ||
                  "";

                if (Number(item.Dbfieldid) === Number(8404))
                item.Value =
                formatDateTimeNew(ParsedJson[0]["Next Pay Increase Date"]) ||
                  "";


               if (Number(item.Dbfieldid) === Number(7654))
                  item.Value = ParsedJson[0]["Average Hours Per Week"] || "";

                  if (Number(item.Dbfieldid) === Number(6733))
              item.Value = FormatPhone(ParsedJson[0]["Employer Phone Number"]) || "";

              if (Number(item.Dbfieldid) === Number(7248))
              item.Value = ParsedJson[0]["Printed Employer Name"] || "";

              if (Number(item.Dbfieldid) === Number(8377))
              item.Value =  formatDateTimeNew(ParsedJson[0]["Date"]) ||
              "";
            if (Number(item.Dbfieldid) === Number(4771))
              item.Value = ParsedJson[0]["Employer Job Title"] || "";
            

              if (Number(item.Dbfieldid) === Number(8408))
              item.Value = ParsedJson[0]["Signed"] || "";


              if (Number(item.Dbfieldid) === Number(8410))
              item.Value = ParsedJson[0]["Bonus Continuance"] || "";



              if (Number(item.Dbfieldid) === Number(8409))
              item.Value = ParsedJson[0]["Overtime Continuance"] || "";


              if (Number(item.Dbfieldid) === Number(7646))
              item.Value = ParsedJson[0]["Period"] || "";

            if (Number(item.Dbfieldid) === Number(7792))
              item.Value = ParsedJson[0].Year || "";

            if (Number(item.Dbfieldid) === Number(2884))
              item.Value = ParsedJson[0]["Which Borrower"] || "";

            if (Number(item.Dbfieldid) === Number(2891))
              item.Value = ParsedJson[0]["Employer Name"] || "";

            if (Number(item.Dbfieldid) === Number(7793))
              item.Value = formatDateTimeNew(ParsedJson[0]["VOE Paid Thru"]) || "";

            if (Number(item.Dbfieldid) === Number(2893))
              item.Value = formatDateTimeNew(ParsedJson[0]["Employed From"]) || "";

            if (Number(item.Dbfieldid) === Number(2896))
              item.Value = ParsedJson[0]["Job Title"] || "";

            if (Number(item.Dbfieldid) === Number(6529))
              item.Value =
                ParsedJson[0]["Probability of Continued Employment"] || "";
          });

          setDocDbFields(DocDbFields);

            
           if (DocTypeValue == 23 && ParsedJson.length > 1){
            let BindVOEValue = [];
            for (let index = 1; index < ParsedJson.length; index++) {
              let iItem = JSON.parse(JSON.stringify(DocDbFields));
              for (let j = 0; j < iItem.length; j++) {
              //let BindVOEValue_ = DocDbFields
              let item =iItem[j]

              if (Number(item.Dbfieldid) === Number(7652))
              item.Value =
                formatCurrency(ParsedJson[index]["VOE line 12 B Base Pay."]) || "";

            if (Number(item.Dbfieldid) === Number(7655))
              item.Value =
                formatCurrency(ParsedJson[index]["VOE line 12 B. Overtime Income."]) ||
                "";

            if (Number(item.Dbfieldid) === Number(7656))
              item.Value =
                formatCurrency(
                  ParsedJson[index]["VOE line 12 B. Commission Income."]
                ) || "";

            if (Number(item.Dbfieldid) === Number(7657))
              item.Value =
                formatCurrency(ParsedJson[index]["VOE line 12 B. Bonus Income."]) ||
                "";

             if (Number(item.Dbfieldid) === Number(8407))
                item.Value =
                  formatCurrency(ParsedJson[index]["Last Pay Increase Amount"]) ||
                  "";

                  if (Number(item.Dbfieldid) === Number(8406))
                  item.Value =
                  formatDateTimeNew(ParsedJson[index]["Last Pay Increase Date"]) ||
                    "";

                    if (Number(item.Dbfieldid) === Number(8405))
                item.Value =
                  formatCurrency(ParsedJson[index]["Next Pay Increase Amount"]) ||
                  "";

                if (Number(item.Dbfieldid) === Number(8404))
                item.Value =
                formatDateTimeNew(ParsedJson[index]["Next Pay Increase Date"]) ||
                  "";


               if (Number(item.Dbfieldid) === Number(7654))
                  item.Value = ParsedJson[index]["Average Hours Per Week"] || "";

                  if (Number(item.Dbfieldid) === Number(6733))
              item.Value = FormatPhone(ParsedJson[index]["Employer Phone Number"]) || "";

              if (Number(item.Dbfieldid) === Number(7248))
              item.Value = ParsedJson[index]["Printed Employer Name"] || "";

              if (Number(item.Dbfieldid) === Number(8377))
              item.Value =  formatDateTimeNew(ParsedJson[index]["Date"]) ||
              "";
            if (Number(item.Dbfieldid) === Number(4771))
              item.Value = ParsedJson[index]["Employer Job Title"] || "";
            

              if (Number(item.Dbfieldid) === Number(8408))
              item.Value = ParsedJson[index]["Signed"] || "";


              if (Number(item.Dbfieldid) === Number(8410))
              item.Value = ParsedJson[index]["Bonus Continuance"] || "";



              if (Number(item.Dbfieldid) === Number(8409))
              item.Value = ParsedJson[index]["Overtime Continuance"] || "";


              if (Number(item.Dbfieldid) === Number(7646))
              item.Value = ParsedJson[index]["Period"] || "";



            if (Number(item.Dbfieldid) === Number(2884))
              item.Value = ParsedJson[index]["Which Borrower"] || "";

            if (Number(item.Dbfieldid) === Number(2891))
              item.Value = ParsedJson[index]["Employer Name"] || "";

            if (Number(item.Dbfieldid) === Number(7793))
              item.Value = formatDateTimeNew(ParsedJson[index]["VOE Paid Thru"]) || "";

            if (Number(item.Dbfieldid) === Number(2893))
              item.Value = formatDateTimeNew(ParsedJson[index]["Employed From"]) || "";

            if (Number(item.Dbfieldid) === Number(2896))
              item.Value = ParsedJson[index]["Job Title"] || "";

            if (Number(item.Dbfieldid) === Number(6529))
              item.Value =
                ParsedJson[index]["Probability of Continued Employment"] || "";
                }
            BindVOEValue.push(...iItem)

            }
            setDocDbFieldsVOE([...BindVOEValue]
            );
          }

          setUpdateMappingonlyonNew(false);
          setOrgDocDbFields(structuredClone(DocDbFields));
        }
        } else if (Number(doctypeId) === Number(253)) {
          console.log(ParsedJson);
          DocDbFields.forEach((item) => {
            if (Number(item.Dbfieldid) === Number(2891))
              item.Value = ParsedJson["Name of Employer"] || "";

            if (Number(item.Dbfieldid) === Number(7649))
              item.Value =
                formatCurrency(
                  ParsedJson[
                    "W-2. Specific Employer Line 1. Wages, Tips, and Other Compensation. Total Income."
                  ]
                ) || "";

            if (Number(item.Dbfieldid) === Number(2884))
              item.Value = ParsedJson["Which Borrower"] || "";

            if (Number(item.Dbfieldid) === Number(7792))
              item.Value = ParsedJson.Year || "";
          });

          setDocDbFields(DocDbFields);

          // if (DocTypeValue == 23)
          //   setDocDbFieldsVOE(
          //     JSON.parse(JSON.stringify([...DocDbFields, ...DocDbFields]))
          //   );

          setUpdateMappingonlyonNew(false);
          setOrgDocDbFields(structuredClone(DocDbFields));
        } else {
          DocDbFields.map((item) => {
            item["Value"] = ParsedJson[item.DisplayName.replace("#", "")];
            if (Number(item.Dbfieldid) === Number(4652))
              item.Value = FormatPhone(ParsedJson["Agent Phone"]) || "";
            return item;
          });
        }
      }
    }
  }

  function fnUpdateOriginalJSON(DBFields, flag) {
    // debugger;
    let OriginalJSON_ = OriginalResponsefromAPI || OriginalResJSON;
    if (OriginalJSON_ !== "") {
      OriginalJSON_ = JSON.parse(OriginalJSON_)["extraction_json"] ?? {};
      if (OriginalJSON_ !== undefined || OriginalJSON_ !== "") {
        if (Number(DocTypeValue) === 169) {
          OriginalJSON_["Name of Employer"] = ResJSON["Name of Employer"];
          OriginalJSON_["Which Borrower"] = ResJSON["Which Borrower"];
          OriginalJSON_["Employer Zip Code"] = ResJSON["Employer Zip Code"];
          OriginalJSON_["Gross Pay"] = ResJSON["Gross Pay"];
          OriginalJSON_["Hours Worked Per Week"] =
            ResJSON["Hours Worked Per Week"];
          OriginalJSON_["Paid From Date"] = ResJSON["Paid From Date"];
          OriginalJSON_["Paid To Date"] = ResJSON["Paid To Date"];
          OriginalJSON_["Pay Frequency"] = ResJSON["Pay Frequency"];
          OriginalJSON_["YTD Earnings"] = ResJSON["YTD Earnings"];

          OriginalJSON_["Employer State"] = ResJSON["Employer State"];
          OriginalJSON_["Employer Full Address"] =
            ResJSON["Employer Full Address"];
          OriginalJSON_["Employer City"] = ResJSON["Employer City"];
          OriginalJSON_["Employer Address"] = ResJSON["Employer Address"];
        } else {
          if (
            Number(DocTypeValue) === 43 &&
            OriginalJSON_.financial_institution !== undefined
          ) {
            DocDbFields.forEach((item) => {
              if (Number(item.Dbfieldid) === Number(3058))
                OriginalJSON_.financial_institution = item.Value;

              if (Number(item.Dbfieldid) === Number(8386))
                OriginalJSON_.beginning_date = item.Value;

              if (Number(item.Dbfieldid) === Number(8387))
                OriginalJSON_.ending_date = item.Value;

              if (Number(item.Dbfieldid) === Number(3052))
                OriginalJSON_.account_holder[0] = item.Value;

              if (Number(item.Dbfieldid) === Number(3061))
                OriginalJSON_.account_number[0] = item.Value;

              // if (Number(item.Dbfieldid) === Number(3062))
              //   OriginalJSON_.current_balance[0] = item.Value;

              // if (Number(item.Dbfieldid) === Number(8388)) {
              //   if (OriginalJSON_.qualifying_balance[0] != undefined)
              //     OriginalJSON_.qualifying_balance[0] = item.Value;
              //   else OriginalJSON_.qualifying_balance = [item.Value];
              // }
              // if (Number(item.Dbfieldid) === Number(3059)) {
              //   OriginalJSON_.account_type = AssetTypeOptionValue;
              // }
            });
          } else {
            // if (Number(DocTypeValue) === 23 || Number(DocTypeValue) === 253) {
            console.log("DocDbFields", DocDbFields);
            OriginalJSON_ = DocDbFields.reduce((result, item) => {
              result[item.DisplayName] = item.Value;
              return result;
            }, {});
          }
        }
      }
    }

    if (flag === 1) return OriginalJSON_;
    else {
      let OrginRes = JSON.parse(OriginalResponsefromAPI || OriginalResJSON);
      OrginRes["extraction_json"] = OriginalJSON_;
      if (Number(DocTypeValue !== 169))
        setOriginalResponsefromAPI(JSON.stringify(OrginRes));

      return JSON.stringify(OrginRes)
        .replace("#", "")
        .replace("?", "")
        .replace("%", "");
    }
  }

  function fnSendFeedbacktoAPI(DocDbFields__) {
    // debugger;
    let docType = DocType.filter(
        (items) =>
          parseInt(items.Id) === parseInt(Details["DocType"] || DocTypeValue)
      ),
      originalData = {},
      file_ = file,
      fileName = "";
    
    let validateJSON = fnCheckFeedbackJSON(Details["DocType"] || DocTypeValue, DocDbFields__);
    if (
      validateJSON ||
      FeedBackCollection
    ) {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", "9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3");
      myHeaders.append("Content-Type", "application/json");

      let FirstTimeLog = 0;
      if (FeedBackCollection && validateJSON === false) FirstTimeLog = 1;
      setFeedBackCollection(false);
      let UploadedMonthlyIncome = uploadedDocument.filter(
        (item) => item.ScanDocId == scandocId
      );
      console.log("UP", UploadedMonthlyIncome[0].Task_Id);
      // return;
      originalData = {
        doc_type: docType[0].DocType,
        // task_id:
        //   docType[0].DocType === "Pay Stub"
        //     ? JSON.parse(OriginalResJSON)["task_id"]
        //     : UploadedMonthlyIncome[0].Task_Id,
        ...(docType[0].DocType === "Pay Stub"
          ? ResJSON
          : Number(DocTypeValue) === 43
          ? fnUpdateOriginalJSON("", 1)
          : DocDbFields.reduce((result, item) => {
              result[item.DisplayName] = item.Value;
              return result;
            }, {})),
      };
      if (Number(DocTypeValue) === 23) {
        let arr = [];
        arr.push(originalData);
        const middleIndex = Math.floor(DocDbFieldsVOE.length / 2),
          firstArray = DocDbFieldsVOE.slice(0, middleIndex),
          secondArray = DocDbFieldsVOE.slice(middleIndex);
        arr.push({
          doc_type: docType[0].DocType,
          ...firstArray.reduce((result, item) => {
            result[item.DisplayName] = item.Value;
            return result;
          }, {}),
        });
        arr.push({
          doc_type: docType[0].DocType,
          ...secondArray.reduce((result, item) => {
            result[item.DisplayName] = item.Value;
            return result;
          }, {}),
        });
        originalData = arr;
      }
      debugger;
      console.log("file=====>", file);
      console.log("=====>", JSON.stringify(originalData));
      // return;

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        // body: formdata,
        redirect: "follow",
        crossDomain: true,
      };

      fetch(
        "https://www.solutioncenter.biz/LoginCredentialsAPI/api/SendFeedbacktoAPI?LoanId=" +
          LoanId +
          "&JSONInput=" +
          JSON.stringify(originalData)
            .replace("#", "")
            .replace("?", "")
            .replace("%", "") +
          "&ScandocId=" +
          scandocId +
          "&SessionId=" +
          SessionId +
          "&IsIgnored=false" +
          "&doc_type=" +
          docType[0].DocType +
          "&FirstTimeLog=" +
          FirstTimeLog,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          //    console.log(result);
          handleFooterMsg(JSON.parse(result)["message"]);
          // document.getElementById("spnResubmitdiv").style.display = "none";
          // document.getElementById("ResubmitProgress").style.display = "none";
        })
        .catch((error) => {
          console.log("error", error);
          // document.getElementById("spnResubmitdiv").style.display = "none";
          // document.getElementById("ResubmitProgress").style.display = "none";
        });
    }
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
            Document Upload
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
                setDocTypeValue={setDocTypeValue}
                setDocDbFields={setDocDbFields}
                setFieldExtractProgres={setFieldExtractProgres}
                setTaskId={setTaskId}
                setActiveDropzone={setActiveDropzone}
                IncomeCalcProgres={IncomeCalcProgres}
                fnCheckBorrEntityExistsValidation={
                  fnCheckBorrEntityExistsValidation
                }
                fnUpdateDocdeatails={fnUpdateDocdeatails}
                setFeedBackCollection={setFeedBackCollection}
                setMultipleProgressbar={setMultipleProgressbar}
                MultipleProgressbar={MultipleProgressbar}
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
                    e.PassedValidation === 0 || e.PassedValidation === undefined
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
                        setDocTypeValue={setDocTypeValue}
                        setDocDbFields={setDocDbFields}
                        setFieldExtractProgres={setFieldExtractProgres}
                        setTaskId={setTaskId}
                        setActiveDropzone={setActiveDropzone}
                        IncomeCalcProgres={IncomeCalcProgres}
                        fnCheckBorrEntityExistsValidation={
                          fnCheckBorrEntityExistsValidation
                        }
                        fnUpdateDocdeatails={fnUpdateDocdeatails}
                        setFeedBackCollection={setFeedBackCollection}
                        setMultipleProgressbar={(fileDetails) => {
                          let tempDocDetaisls = DocDetails;
                          tempDocDetaisls[index].MultipleProgressbar =
                            fileDetails;
                          setDocDetails([...tempDocDetaisls]);
                        }}
                        MultipleProgressbar={item.MultipleProgressbar}
                      />
                    );
                  })}
                <div className="pagebottom" style={{ marginBottom: 10 }}>
                  <span className="footertext">Column Bottom</span>
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
                        setFieldExtractProgres={setFieldExtractProgres}
                      />
                    );
                  })}
              </div>
            </TabPanel>
          </Tabs>
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
                      if (DocTypeValue !== 169)
                        fnGetDocTypeDBField(DocTypeValue);

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
                  <Tab
                    onClick={() =>
                      setTimeout(() => {
                        handleDocumentUploadChange(scandocId);
                      }, 200)
                    }
                  >
                    Fields
                  </Tab>
                  <Tab>JSON</Tab>
                </TabList>
                <TabPanel style={{ overflow: "auto", height: "76vh" }}>
                  {FieldExtractProgres && (
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
                  {file && (
                    <>
                      <div>
                        {/* <label>Confidence Score:</label> */}
                        <span id="spnConfidenceScore"></span>
                        {/* <span
                          id="spnResubmitdiv"
                          style={{ display: "none", marginLeft: "25px" }}
                        >
                          <Stack spacing={2} direction="row">
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              id="btnResubmitdocu"
                              onClick={() => {
                                document.getElementById(
                                  "ResubmitProgress"
                                ).style.display = "inline-block";
                                fnSendFeedbacktoAPI();
                              }}
                              style={{
                                cursor: "pointer",
                                marginBottom: "5px",
                              }}
                            >
                              Resubmit Document
                            </Button>
                            <div
                              style={{ display: "none" }}
                              id="ResubmitProgress"
                            >
                              <CircularProgress
                                size={15}
                                style={{ margin: "0px 5px 0px 15px" }}
                              />
                              <span
                                style={{
                                  verticalAlign: "top",
                                  fontSize: "12px",
                                }}
                              ></span>
                            </div>
                          </Stack>
                        </span> */}
                      </div>
                      <DropDown
                        label="Document Type"
                        options={DocType}
                        value="Id"
                        text="DocType"
                        name="DocType"
                        SelectedVal={DocTypeValue}
                        onChange={fnValueChange}
                      />
                    </>
                  )}
                  {DocTypeValue !== 0 &&
                  DocTypeValue === 169 &&
                  Object.keys(ResJSON).length > 0 ? (
                    <>
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
                  ) : (
                    // ) : ResJSON !== {} ? (
                    //   <>{ResJSON}</>
                    // ExtractResult.length > 0 ? (
                    //   ExtractResult
                    // ) :
                    <></>
                  )}
                  {file &&
                    DocTypeValue !== 0 &&
                    DocDbFields.map((fields, index) => (
                      <>
                        {fields.ElementType === 1 ? (
                          <MultipleSelectCheckmarks
                            handleMultiSelect={handleMultiSelect}
                            value={AssetTypeOptionValue || ""}
                            label="Type of Account"
                            Options={AssetTypeOPtions}
                            Typevalue="TypeOption"
                            TypeText="TypeDesc"
                          ></MultipleSelectCheckmarks>
                        ) : (
                          // : fields.DisplayName === "Which Borrower" ? (
                          //   <WhichBorrowerList fields={fields} index={index} />
                          //   // <>
                          //   //   {WhichBorrowerList({
                          //   //     fields,
                          //   //     index,
                          //   //   })}
                          //   // </>
                          // )
                          <DynamicTextBox
                            name={fields.DisplayName}
                            value={fields["Value"] || ""}
                            onChange={(obj) => {
                              let { name, value } = obj.target,
                                DocDbFields_ = DocDbFields;

                              DocDbFields_[index]["Value"] = value;

                              setDocDbFields([...[], ...DocDbFields_]);

                              // setOrgDocDbFields([...[], ...DocDbFields_]);

                              // if (name === "Beginning Date")
                              //   value = convertToFourDigitYear(value);
                            }}
                            onblur={() => {
                              
                              
                              if (
                                fields.DisplayName.toString().toLowerCase().indexOf("phone") > -1) {

                                  let formattedValue = FormatPhone(fields["Value"]),
                                  DocDbFields_ = DocDbFields;
                                  DocDbFields_[index]["Value"] = formattedValue;
                                  setDocDbFields([...[], ...DocDbFields_]);
                                }



                              if (
                                fields.DisplayName.toString().indexOf(
                                  "Paid Thru"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Employed From"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf("Date") >
                                  -1
                              ) {
                                let DateformattedValue = formatDateTimeNew(
                                    fields["Value"]
                                  ),
                                  DocDbFields_ = DocDbFields;
                                DocDbFields_[index]["Value"] =
                                  DateformattedValue;

                                setDocDbFields([...[], ...DocDbFields_]);
                              }


                              
                              if (
                                fields.DisplayName.toString().indexOf(
                                  "Balance"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Amount"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Base Pay"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Overtime Income"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Commission Income."
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "Bonus Income"
                                ) > -1 ||
                                fields.DisplayName.toString().indexOf(
                                  "W-2. Specific Employer Line 1. Wages, Tips, and Other Compensation. Total Income."
                                ) > -1
                              ) {
                                let formattedValue = formatCurrency(
                                    fields["Value"],
                                    2
                                  ),
                                  DocDbFields_ = DocDbFields;
                                DocDbFields_[index]["Value"] = formattedValue;

                                setDocDbFields([...[], ...DocDbFields_]);
                                // setOrgDocDbFields([...[], ...DocDbFields_]);
                              }
                              setEnableSave(true);
                            }}
                            label={fields.DisplayName}
                            onMouseHover={(e, value) => {
                              handleFindFormToElements(e, true, value);
                              // extractText();
                            }}
                            onMouseLeave={handleRemoveLine}
                            setChangeLogModalOpen={setChangeLogModalOpen}
                            LoanId={LoanId}
                            DbFieldId={fields.Dbfieldid}
                            ScanDocId={scandocId}
                            setChangeLogData={setChangeLogData}
                          />
                        )}
                      </>
                    ))}

                  {file &&
                    Number(DocTypeValue) === 23 &&
                    DocTypeValue !== 0 &&
                   DocDbFieldsVOE.map((fields, index) => {
                        return (
                          <>
                            {[0,24,48].includes(index)  && (
                              <div
                                style={{
                                  borderBottom: "2px solid grey",
                                  height: "0px",
                                  marginBottom: "20px",
                                  width: "99%",
                                }}
                              >
                                &nbsp;
                              </div>
                            )}
                            {/* {fields.ElementType === 1 ? (
                          <MultipleSelectCheckmarks
                            handleMultiSelect={handleMultiSelect}
                            value={AssetTypeOptionValue || ""}
                            label="Type of Account"
                            Options={AssetTypeOPtions}
                            Typevalue="TypeOption"
                            TypeText="TypeDesc"
                          ></MultipleSelectCheckmarks>
                        ): ( */}
                            <DynamicTextBox
                              name={fields.DisplayName}
                              value={fields["Value"] || ""}
                              onChange={(obj) => {
                                let { name, value } = obj.target,
                                  DocDbFields_ = DocDbFieldsVOE;

                                DocDbFields_[index]["Value"] = value;

                                setDocDbFieldsVOE([...[], ...DocDbFields_]);

                                // setOrgDocDbFields([...[], ...DocDbFields_]);

                                // if (name === "Beginning Date")
                                //   value = convertToFourDigitYear(value);
                              }}
                              onblur={() => {
                                    
                                if (
                                  fields.DisplayName.toString().toLowerCase().indexOf("phone") > -1) {
  
                                    let formattedValue = FormatPhone(fields["Value"]),
                                    DocDbFields_ = DocDbFields;
                                    DocDbFields_[index]["Value"] = formattedValue;
                                    setDocDbFields([...[], ...DocDbFields_]);
                                  }

                                if (
                                  fields.DisplayName.toString().indexOf(
                                    "Paid Thru"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Employed From"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Date"
                                  ) > -1
                                ) {
                                  let DateformattedValue = formatDateTimeNew(
                                      fields["Value"]
                                    ),
                                    DocDbFields_ = DocDbFieldsVOE;
                                  DocDbFields_[index]["Value"] =
                                    DateformattedValue;

                                  setDocDbFieldsVOE([...[], ...DocDbFields_]);
                                }

                                if (
                                  fields.DisplayName.toString().indexOf(
                                    "Balance"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Amount"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Base Pay"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Overtime Income"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Commission Income."
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "Bonus Income"
                                  ) > -1 ||
                                  fields.DisplayName.toString().indexOf(
                                    "W-2. Specific Employer Line 1. Wages, Tips, and Other Compensation. Total Income."
                                  ) > -1
                                ) {
                                  let formattedValue = formatCurrency(
                                      fields["Value"],
                                      2
                                    ),
                                    DocDbFields_ = DocDbFieldsVOE;
                                  DocDbFields_[index]["Value"] = formattedValue;

                                  setDocDbFieldsVOE([...[], ...DocDbFields_]);

                                  // setOrgDocDbFields([...[], ...DocDbFields_]);
                                }
                                setEnableSave(true);
                              }}
                              label={fields.DisplayName}
                              onMouseHover={(e, value) => {
                                handleFindFormToElements(e, true, value);
                                // extractText();
                              }}
                              onMouseLeave={handleRemoveLine}
                              setChangeLogModalOpen={setChangeLogModalOpen}
                              LoanId={LoanId}
                              DbFieldId={fields.Dbfieldid}
                              ScanDocId={scandocId}
                              setChangeLogData={setChangeLogData}
                            />
                            {/* )} */}
                          </>
                        );
                     
                    })}
                  {Object.keys(ResJSON).length > 0 || file ? (
                    <div className="pagebottom">
                      <span className="footertext">Column Bottom</span>
                    </div>
                  ) : (
                    ""
                  )}
                </TabPanel>
                <TabPanel>
                  {FieldExtractProgres && (
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
                  {(OriginalResponsefromAPI || OriginalResJSON) && (
                    <div>
                      <pre style={{ maxHeight: "78vh" }}>
                        {OriginalResponsefromAPI || OriginalResJSON}
                      </pre>
                    </div>
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
                className="btnLoanApp"
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
                      openNewWindow(
                        `/AgGrid?LoanId=${LoanId}&SessionId=${SessionId}&ScandocId=${
                          scandocId || 0
                        }`
                      );
                      // console.log("FeedBack");
                    },
                  },
                  Number(userId) === 2099 ||
                    (Number(userId) === 1 && {
                      title: "OCR Data to Recognize",
                      click: (e) => {
                        // window.open("www.google.com", "mozillaWindow", "popup");
                        // window.open(
                        //   <AgGrid />,
                        //   "",
                        //   "width=1200,height=1200,resizable=yes,scrollbars=yes"
                        // );
                        openNewWindow(
                          `https://www.directcorp.com/ImageChecklist/Presentation/Webforms/ImageChecklist_Setup.aspx?SessionID=${SessionId}&DocType=${DocTypeValue}`,
                          1
                        );
                        // console.log("FeedBack");
                      },
                    }),

                  {
                    title: "Scanned Images",
                    click: (e) => {
                      openNewWindow(
                        `https://www.directmortgage.com/BorrowerApplication/Presentation/Webforms/ScanLoanDocs_DataPipeline.aspx?SessionID=${SessionId}&LoanId=${LoanId}&CustId=${BorrowerList[0].CustId}`,
                        1
                      );
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
                console.log("MultipleProgressbar:", MultipleProgressbar);
                console.log("DocType", DocType);
                console.log("UploadedDocument", uploadedDocument);

                let FilterDoc = "";
                if (MultipleProgressbar.length > 0) {
                  FilterDoc = DocType.filter(
                    (item) => item.Id === Number(DocTypeValue)
                  );
                }

                MultipleProgressbar.forEach((element) => {
                  if (Number(element.ScandocId) === scandocId) {
                    element.docMovedMessage = `This document is recognized as ${FilterDoc[0].DocType} and was moved to ${FilterDoc[0].DocType} section.`;
                    element.docTypeId = Number(DocTypeValue);
                    element.docType = FilterDoc[0].DocType;
                  }
                });
                setMultipleProgressbar(MultipleProgressbar);

                if (Number(DocTypeValue) !== 169) fnSaveOtherDBField();
                else fnCheckBorrEntityExistsValidation();
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
            DocTypeValue={DocTypeValue}
            fnSaveOtherDBField={fnSaveOtherDBField}
            DocDbFields={DocDbFields}
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
