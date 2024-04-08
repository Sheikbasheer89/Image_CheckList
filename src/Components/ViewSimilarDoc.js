import React, { useState, useEffect, useRef, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { handleAPI, Context } from "./CommonFunction";
import NewWindow from "react-new-window";

import "../Components/AgStyle.css";
import "../Components/agGridBlue.css";
import CustomizedSnackbars from "./MessageComponents";
import CircularProgress from "@mui/material/CircularProgress";



const ViewSimilarDoc = (props) => {
  // console.log(props);
  //   let LoanId = props.LoanId;
  const [ViewSimilarDocDetails, setViewSimilarDocDetails] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [RespMsg, setRespMsg] = useState("");
  const gridRef = useRef(null);
  const [openMsg, setOpenMsg] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [selDocId, setSelDocId] = useState(0);

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

    setSessionId(searchParams.get("SessionId"));
    setSelDocId(searchParams.get("docId"));

    handleAPI({
      name: "GetSimilarDoc",
      params: {        
        DocId: searchParams.get("docId"),
      },
    })
      .then((response) => {
        //debugger;
        // console.clear();
        //    console.log(response);
        setViewSimilarDocDetails(
          JSON.parse(response)
        );
        let SimilarDocRowData = [];
        JSON.parse(response).map(
          (item, index) => {
            //    console.log(item);
            SimilarDocRowData.push({
              Id: item.ID,
              key: index,
              "Document Type": item.DocType,
              "Loan Number": item.LoanId,
              "Verified": item.Verified,              
              ScanDocId: item.ID,
              
              
            });
          }
        );
        setRowData(SimilarDocRowData);
      })
      .catch((error) => {
        ////debugger;
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

            let irowData = [];
            params.api.forEachNode((node) => {
                if (node.data.key === params.rowIndex) {
                    irowData.push(node.data);
                }
            });

            const currentURL = window.location.href;
            const iurl = new URL(currentURL);
            const domainName = iurl.hostname;
            // const url = 'https://example.com';
            const url =  `https://${domainName}/imagechecklistreact/index.html?SessionId=${sessionId}&LoanId=${irowData[0]['Loan Number']}&DocId=${irowData[0]['ScanDocId']}&Dtype=${selDocId}`
            // // Options for the popup window
            const popupOptions = 'width=1600,height=1200';
        
            // // Open the popup window
            window.open(url, '_blank', popupOptions);
            
          }}
        >
          {params.value}
        </a>
        
      </span>
    );
  }
  
  const columnDefs = [
    
    {
        field: "Document Type",
        cellRenderer: MyRenderer,
        autoSize: true,
        maxWidth: 150,
        sortable:true,
      },
    { field: "Loan Number", autoSize: true, maxWidth: 150, sortable:true },
    { field: "Verified", autoSize: true, maxWidth: 150, sortable:true },
   
    
  ];
  const gridOptions = {
    domLayout: "autoHeight",
    suppressRowTransform: true,
    sortable: true,
  };

  return (
    <>
      <div className="ag-theme-blue" style={{ width: "30%", padding: 20 }}>
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

export default ViewSimilarDoc;
