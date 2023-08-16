import React, { useState, useEffect, useRef, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { handleAPI, Context } from "./CommonFunction";
import NewWindow from "react-new-window";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import "../Components/AgStyle.css";
import "../Components/agGridBlue.css";
import CustomizedSnackbars from "./MessageComponents";
import CircularProgress from "@mui/material/CircularProgress";

// import { ModuleRegistry } from "@ag-grid-community/core";
// // Register the required feature modules with the Grid
// ModuleRegistry.registerModules([
//   ClientSideRowModelModule,
//   RangeSelectionModule,
//   RowGroupingModule,
//   RichSelectModule,
// ]);

const AgGrid = (props) => {
  // console.log(props);
  //   let LoanId = props.LoanId;
  const [FeedBackDetails, setFeedBackDetails] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [RespMsg, setRespMsg] = useState("");
  const gridRef = useRef(null);
  const [openMsg, setOpenMsg] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);

    handleAPI({
      name: "GetFeedBackAPIChangeLog",
      params: {
        LoanId: searchParams.get("LoanId"),
        ScandocIdd: searchParams.get("ScandocId"),
      },
    })
      .then((response) => {
        debugger;
        // console.clear();
        //    console.log(response);
        setFeedBackDetails(
          JSON.parse(JSON.parse(response).Table[0]["Column1"])
        );
        let FeedBackRowData = [];
        JSON.parse(JSON.parse(response).Table[0]["Column1"]).map(
          (item, index) => {
            //    console.log(item);
            FeedBackRowData.push({
              Id: item.Id,
              key: index,
              "Request Sent": item.RequestSendOn,
              "Response Received": item.ResponseReceivedOn,
              "Response Json": JSON.parse(item.FeedbackResponse).message,
              "Requested Json": "",
              "Requested By": item.RequestBy,
              Ignore: "",
              Changes: "",
              ScanDocId: item.ScanDocId,
              Id: item.Id,
              IsIgnore: item.IsIgnore,
              RequestedData: JSON.parse(item.FeedbackRequest),
            });
          }
        );
        setRowData(FeedBackRowData);
      })
      .catch((error) => {
        //debugger;
        console.log("error", error);
      });
  }, []);

  const onGridReady = () => {
    setTimeout(() => {
      handleResize();
    }, 500);
  };
  function MyRenderer(params) {
    return (
      <span className="my-renderer">
        <a
          href="#"
          style={{ cursor: "pointer" }}
          onClick={() => {
            debugger;
            //  console.log(params);

            const element = document.createElement("a");
            const file = new Blob(
              [JSON.stringify(params.data.RequestedData, null, " ")],
              {
                type: "text/plain;charset=utf-8",
              }
            );
            element.href = URL.createObjectURL(file);
            element.download = `RequestJson_${params.data.RequestedData.task_id}.txt`;
            document.body.appendChild(element);
            element.click();
          }}
        >
          View
        </a>
        {params.value}
      </span>
    );
  }

  function MyRendererChanges(params) {
    return (
      <span className="my-renderer">
        <a
          href="#"
          style={{ cursor: "pointer" }}
          onClick={() => {
            debugger;
            //  console.log(params);

            // const element = document.createElement("a");
            // const file = new Blob(
            //   [JSON.stringify(params.data.RequestedData, null, " ")],
            //   {
            //     type: "text/plain;charset=utf-8",
            //   }
            // );
            // element.href = URL.createObjectURL(file);
            // // element.download = `RequestJson_${params.data.RequestedData.task_id}.txt`;
            // document.body.appendChild(element);
            // element.click();
          }}
        >
          View
        </a>
        {params.value}
      </span>
    );
  }

  function fnSendFeedbacktoAPI(originalData, scandocId, FId, IsIgnore) {
    debugger;
    // return;
    if (scandocId === 0) return;
    let Ignore = "true";
    if (Number(IsIgnore) === 1) Ignore = "false";
    console.log(originalData, scandocId);
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "9cQKFT3dYKrOnF8CEDKO4DTaSKxrHUD4JK8f3tT3");
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      // body: formdata,
      redirect: "follow",
      crossDomain: true,
    };

    fetch(
      "https://www.solutioncenter.biz/LoginCredentialsAPI/api/SendFeedbacktoAPI?LoanId=" +
        searchParams.get("LoanId") +
        "&JSONInput=" +
        originalData.replace("#", "").replace("?", "").replace("%", "") +
        "&ScandocId=" +
        scandocId +
        "&SessionId=" +
        searchParams.get("SessionId") +
        "&IsIgnored=" +
        Ignore +
        "&FeedbackId=" +
        FId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        //    console.log(result);
        // handleFooterMsg(JSON.parse(result)["message"]);

        setRespMsg(JSON.parse(result)["message"]);
        setOpenMsg(true);
        document.querySelector("#spnProgress_" + FId).style.display = "none";
        // document.getElementById("spnResubmitdiv").style.display = "none";
        // document.getElementById("ResubmitProgress").style.display = "none";
      })
      .catch((error) => {
        console.log("error", error);
        // document.getElementById("spnResubmitdiv").style.display = "none";
        // document.getElementById("ResubmitProgress").style.display = "none";
      });
  }

  function MyRendererIgnore(params) {
    return params.data.IsIgnore !== 2 ? (
      <span className="my-renderer">
        <button
          style={{ cursor: "pointer", lineHeight: "0.5" }}
          className={
            Number(params.data.IsIgnore) === 1
              ? "btn btn-warning"
              : "btn btn-primary"
          }
          onClick={() => {
            debugger;
            document.querySelector(
              "#spnProgress_" + params.data.Id
            ).style.display = "inline-block;";

            fnSendFeedbacktoAPI(
              JSON.stringify(params.data.RequestedData),
              params.data.ScanDocId,
              params.data.Id,
              params.data.IsIgnore
            );
            let RowData_ = rowData;
            RowData_.forEach((row) => {
              if (row.Id === params.data.Id) {
                row.IsIgnore = Number(params.data.IsIgnore) === 1 ? 0 : 1;
              }
            });
            setRowData(RowData_);
          }}
        >
          {Number(params.data.IsIgnore) === 1 ? "Ignored" : "Ignore"}
        </button>{" "}
        <span id={"spnProgress_" + params.data.Id} style={{ display: "none" }}>
          <CircularProgress size={15} style={{ margin: "0px 5px 0px 15px" }} />
        </span>
        {params.value}
      </span>
    ) : (
      ""
    );
  }
  const columnDefs = [
    { field: "Request Sent", autoSize: true, maxWidth: 150 },
    { field: "Response Received", autoSize: true, maxWidth: 150 },
    {
      field: "Requested Json",
      cellRenderer: MyRenderer,
      autoSize: true,
      maxWidth: 150,
    },
    {
      field: "Response Json",
      autoSize: true,
      cellClassRules: {
        "wrap-text": () => true, // Apply wrap-text class to all cells in this column
      },
    },
    { field: "Requested By", autoSize: true, maxWidth: 150 },
    {
      field: "Ignore",
      cellRenderer: MyRendererIgnore,
      autoSize: true,
      maxWidth: 150,
    },
    {
      field: "Changes",
      cellRenderer: MyRendererChanges,
      autoSize: true,
      maxWidth: 150,
    },
  ];
  const gridOptions = {
    domLayout: "autoHeight",
    suppressRowTransform: true,
  };

  return (
    <>
      <div className="ag-theme-blue" style={{ width: "100%", padding: 20 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
      <CustomizedSnackbars
        openMsg={openMsg}
        setOpenMsg={setOpenMsg}
        WhichProcessMsg="-99"
        RespMsg={RespMsg}
      ></CustomizedSnackbars>
    </>
  );
};

export default AgGrid;
