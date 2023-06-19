import React, { useState, useEffect, useRef, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { handleAPI, Context } from "./CommonFunction";
import NewWindow from "react-new-window";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import "../Components/AgStyle.css";
import "../Components/agGridBlue.css";

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

  const gridRef = useRef(null);

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
      params: { LoanId: searchParams.get("LoanId") },
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
  ];
  const gridOptions = {
    domLayout: "autoHeight",
    suppressRowTransform: true,
  };

  return (
    <div className="ag-theme-blue" style={{ width: "100%", padding: 20 }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  );
};

export default AgGrid;
