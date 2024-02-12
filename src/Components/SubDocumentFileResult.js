import { useState, useEffect, useRef, useContext } from "react";
import { handleAPI } from "./CommonFunction";
import React from "react";
import { AgGridReact } from "ag-grid-react";


export default function SubFilesResult() {
  const [SubFiles, setSubFiles] = useState([]);
  const [SubFilesMisc, setSubFilesMisc] = useState([]);
  const [LoanId, setLoanId] = useState(0);
  const gridRef = useRef(null);
  useEffect(() => {
    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    setLoanId(searchParams.get("LoanId"))
    handleAPI({
      name: "GetAllSubFiles",
      params: {
        JobId: searchParams.get("JobId"),
        LoanId: searchParams.get("LoanId"),
      },
    }).then((response) => {
      // console.log(response);
      if (response != "" && response != undefined) {
        response = JSON.parse(response);
        // let WithoutReponseMisc = response.filter((item)=> item.MovedTo !== "Miscellaneous")
        // let WithReponseMisc = response.filter((item)=> item.MovedTo === "Miscellaneous")
        setSubFiles(response);
        // setSubFilesMisc(WithReponseMisc)
        console.log("MultiFileresponse=", response);
      }
    });
  }, []);

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  };

  const onGridReady = () => {
    setTimeout(() => {
      handleResize();
    }, 100);
  };

  const BindResult = ({ SubFiles }) => {
    
    const columnDefs = [
      { headerName: "Document Type Identified", field: "description", sortable: true, dragable: false, width:400 },
      { headerName: "Moved To", field: "movedTo", sortable: true, dragable: false, width:400},
      {
        headerName: "View File",
        field: "viewFile",
        width:100,
        sortable: true,
        cellRendererFramework: (params) => (
          <a
            href="#"
            className="ahrefcls"
            onClick={() => {
              window.opener.document.getElementById('ViewSubFiles').setAttribute("ScandocId", params.data.iiScandocId)
              window.opener.document.getElementById('ViewSubFiles').click();
            }}
            style={{
              verticalAlign: "top",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            View
          </a>
        ),
      },
      { headerName: "Pages Impacted", field: "page_impacted",width:220, sortable: true },
    ];
    
    let MiscCount = 0
    let rowData = SubFiles?.map((row, index) => {
      let parsedJSON = row.ResponseData;
      let fileType = parsedJSON.doc_type || "Miscellaneous";
      let iiScandocId = row.ScandocId;
      let page_start_end = parsedJSON.page_start_end;

      let page_start = page_start_end[0].start || "";
      let page_end = page_start_end[0].end || "";

      if(fileType == "Miscellaneous"){
        page_start = page_start_end[MiscCount]?.start || "";
        page_end = page_start_end[MiscCount]?.end || "";        
      }


      let page_impacted = page_start !== page_end ? `${page_start} - ${page_end}` : page_start;
      let description = `${fileType}`;
      let movedTo = row.MovedTo;
      movedTo = movedTo.replace('IRS Form', 'Tax Return');
      if(movedTo === "1099 Misc - IRS") movedTo = "Tax Return 1099 Misc";
      if(movedTo === "1120S K-1") movedTo = "Tax Return 1120S K-1";
      
      MiscCount = MiscCount + 1

      return {
        iiScandocId,
        description,
        movedTo,
        page_impacted,
        page_start
      };
    });
    rowData = rowData.sort((a, b) => (parseFloat(a.page_start) || 0) - (parseFloat(b.page_start) || 0));
    rowData = rowData.filter((item)=> item.page_impacted != "")
    return (
      <div className="ag-theme-blue" style={{  width: "70%", margin: 15, marginTop:0 }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          
        />
      </div>
    );
  };


  // const BindResultMisc = ({ SubFilesMisc }) => {
    
  //   const columnDefs = [
  //     { headerName: "Document Type Identified", field: "description", sortable: true, dragable: false, width:400 },
  //     { headerName: "Moved To", field: "movedTo", sortable: true, dragable: false, width:400},
  //     {
  //       headerName: "View File",
  //       field: "viewFile",
  //       width:100,
  //       sortable: true,
  //       cellRendererFramework: (params) => (
  //         <a
  //           href="#"
  //           className="ahrefcls"
  //           onClick={() => {
  //             window.opener.document.getElementById('ViewSubFiles').setAttribute("ScandocId", params.data.iiScandocId)
  //             window.opener.document.getElementById('ViewSubFiles').click();
  //           }}
  //           style={{
  //             verticalAlign: "top",
  //             fontSize: "12px",
  //             cursor: "pointer",
  //           }}
  //         >
  //           View
  //         </a>
  //       ),
  //     },
  //     { headerName: "Pages Impacted", field: "page_impacted",width:220, sortable: true },
  //   ];
    
  //   console.log("SubFilesMisc", SubFilesMisc);
  //   let rowData = SubFilesMisc?.map((row, index) => {
  //     let parsedJSON = row.ResponseData;
  //     let fileType = parsedJSON.doc_type || "Miscellaneous";
  //     let iiScandocId = row.ScandocId;
  //     let page_start_end = parsedJSON.page_start_end;
  //     let page_start = page_start_end[index]?.start || "";
  //     let page_end = page_start_end[index]?.end || "";
  //     let page_impacted = page_start !== page_end ? `${page_start} - ${page_end}` : page_start;
  //     let description = `${fileType}`;
  //     let movedTo = row.MovedTo;
  //     movedTo = movedTo.replace('IRS Form', 'Tax Return');
  //     if(movedTo === "1099 Misc - IRS") movedTo = "Tax Return 1099 Misc";
  //     if(movedTo === "1120S K-1") movedTo = "Tax Return 1120S K-1";
      
  //     return {
  //       iiScandocId,
  //       description,
  //       movedTo,
  //       page_impacted,
  //     };
  //   });
  //   rowData = rowData.sort((a, b) => a.description?.localeCompare(b.description));
  //   return (
  //     <div className="ag-theme-blue" style={{ width: "70%", margin: 15, marginTop: 0 }}>
  //       <AgGridReact
  //         ref={gridRef}
  //         columnDefs={columnDefs}
  //         rowData={rowData}
  //         domLayout="autoHeight"
  //         onGridReady={onGridReady}
          
  //       />
  //     </div>
  //   );
  // };
 
  const handleFilterChange = (e) => {
    const value = e.target.value;
    // Assuming ImggridOptions is available globally
    gridRef.current.api.setQuickFilter(value);
    gridRef.current.api.paginationGoToPage(0);
  };

  return (
    <>
     <div id="filterDiv_Acc" style={{ backgroundColor: "#5e9cd3", padding: "5px", color: "white", width: "70%", margin: "15px 15px 0px", textAlign: "right" }}>
        <label style={{ fontSize: '14px', whiteSpace: 'nowrap', margin: '0', fontWeight: '500' }}>
          Filter:&nbsp;
          <input
            type="text"
            // onInput={this.onFilterTextBoxChanged_Acc_New}
            onInput={(e) => {
              let Name = e.currentTarget.textContent || e.target.value;
              handleFilterChange(e);
              
            }}
            id="acc_filter-text-box"
            className="filterdata_acc"
            style={{
              background: '#fff !important',
              outline: 'none',
              color: '#808080 !important',
              border: '1px solid #d5d5d5',
              fontWeight: '100',
              borderRadius: '0 !important',
              width: '125px',
              height: '10px',
              lineHeight: '18px',
              boxSizing: 'content-box',
              padding: '6px',
              paddingLeft: '5px',
            }}
          />
        </label>
      </div>
    <BindResult SubFiles={SubFiles}></BindResult>
    {/* <div style={{marginBottom: "10px"}}></div>
    <div style={{backgroundColor: "#5e9cd3", padding: "10px", color: "white", width: "70%", margin: 15, marginBottom: 0}}>Miscellaneous Documents</div>
    <BindResultMisc SubFilesMisc={SubFilesMisc}></BindResultMisc>
    <div style={{marginBottom: "10px"}}></div> */}
    </>
    // <>
    //   <table className="toolTipTable">
    //     <tr>
    //       <th>Document Type Identified</th>
    //       <th>Moved To</th>
    //       <th>View File</th>
    //       <th>Pages Impacted</th>
    //     </tr>
    //     {SubFiles.map((row, index) => {
    //       // debugger
    //       let parsedJSON = row.ResponseData,
    //         fileType = parsedJSON.doc_type || "Miscellaneous",
    //         iiScandocId = row.ScandocId,
    //         page_start_end = parsedJSON.page_start_end,
    //         page_start = page_start_end[0].start || "",
    //         page_end = page_start_end[0].end || "",
    //         page_impacted = "",
    //         // description = `This document is recognized as ${fileType} and was moved to ${fileType} section.`,
    //         description = `${fileType}`,     
    //         movedTo = row.MovedTo,       
    //         iParsedJson = parsedJSON,
    //         ParsedJson = parsedJSON["extraction_json"];
    //       if (iParsedJson != undefined) {
    //         if (
    //           iParsedJson.hasOwnProperty("extraction_json") &&
    //           Array.isArray(iParsedJson["extraction_json"])
    //         ) {
    //           var extractionJsonArray = iParsedJson["extraction_json"];
    //           ParsedJson = extractionJsonArray[0];
    //         }
    //       }

    //     //   file.ParsedJson = ParsedJson;
    //       if (page_start != page_end) {
    //         page_impacted = page_start + " - " + page_end;
    //       } else page_impacted = page_start;

    //       return (
    //         <>
    //           <tr>
    //             <td>{description}</td>
    //             <td>{movedTo}</td>
    //             <td>
    //               <a
    //                 href="#"
    //                 className="ahrefcls"
    //                 onClick={()=>{
    //                         window.opener.document.getElementById('ViewSubFiles').setAttribute("ScandocId",iiScandocId)
    //                         window.opener.document.getElementById('ViewSubFiles').click();

    //                 }}
    //                 style={{
    //                   verticalAlign: "top",
    //                   fontSize: "12px",
    //                   cursor: "pointer",
    //                 }}
    //               >
    //                 View
    //               </a>
    //             </td>
    //             <td>{page_impacted}</td>
    //           </tr>
    //         </>
    //       );
    //     })}
    //   </table>
    // </>
  );
}







