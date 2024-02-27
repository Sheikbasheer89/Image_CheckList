import React, { Fragment } from "react";
import Button from "@mui/material/Button";
import DropZone from "./DropZone";
import Stack from "@mui/material/Stack";

{
  /* <DropZone
                        typeId={item["DocTypeId"]}
                        label={item["ShortName"]}
                        MultipleProgressbar={item.MultipleProgressbar}
                        {...item}                      
                        {...props}   
                        setMultipleProgressbar // Need to add as paramter                   
                        
                      /> */
}

function ConditionalTable(props) {
  let {
    DocDetails,
    fnCheckConditionalRemainingModel,
    setConditionDetails,
    IncomeCalcProgres,
    CircularProgress,
    handleActivedropzone,
    activeDropzone,
    setMultipleProgressbar,
    setExtractionStatus = "",
    uploadedDocument,    
    UploadedDocValue = null,
  } = props;

  console.log("DocDetails=", DocDetails);
  const sortByKey = (obj, key) => {
    obj = obj.sort((a, b) =>
      a[key].toString().localeCompare(b[key].toString())
    );
    return obj;
  };
  const groupByKey = (input, key) => {
    // input = sortByKey(input, "CustId");
    let data = input.reduce((acc, currentValue) => {
      let groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
      return acc;
    }, {});

    data = Object.keys(data).map((key) => {
      return data[key].map((iItem) => {
        return iItem;
      });
    });
    return data;
  };
  DocDetails = groupByKey(DocDetails, "ID");

  const iReqDocumentfor = {
    RequiredDoc: ["30 days of Paystubs", "W-2", "VOE", "2022 Tax Return"]
  };

  return (
    <div>
      {DocDetails.map((group, index) => {
        let groupArr = group.filter((item) => item.DocTypeId === 169),
          W2Exists = group.some((document) => document.DocTypeId == 253 && document.ScanDocId > 0),
          VOEExists = group.some((document) => document.DocTypeId == 23 && document.ScanDocId > 0),
          TaxReturnExists = group.some((document) => document.DocType && document.DocType.toLowerCase().includes("tax return") && document.ScanDocId > 0),
          isCalculate =
            group[0]["DocType"] &&
            (group[0]["DocType"].toLowerCase().includes("paystub") ||
              group[0]["DocType"].toLowerCase().includes("paystub"));
        return (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #999",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className="table">
              <div className="iheader" style={{ fontWeight: 800 }}>
                {group[0]["DocType"] &&
                group[0]["DocType"].toLowerCase().includes("condition")
                  ? group[0]["DocType"].replace(/&amp;/g, "&")
                  : "Documents Uploaded that are not associated with an Underwriting Condition."}
              </div>
              <div className="iheader">
                <span>Upload</span>
                <span style={{ width: "66.66%" }}>Uploaded Documents Name</span>
                {/* {isCalculate && <span>Calculated Amounts</span>} */}
              </div>

              {group.map((item, iIndex) => (
                <div className="body" key={iIndex}>
                  <span>
                    {" "}
                    <DropZone
                      setExtractionStatus={item.setExtractionStatus}
                      typeId={item["DocTypeId"]}
                      label={item["ShortName"].replace(/&amp;/g, "&")}
                      MultipleProgressbar={item.MultipleProgressbar}
                      {...item}
                      {...props}
                      setMultipleProgressbar={(file) => {
                        debugger;
                        setMultipleProgressbar(file, item["index"]);
                      }}
                    />{" "}
                  </span>
                  <span
                    style={{
                      width: "66.66%",
                      cursor: "pointer",
                      borderColor: "black",
                    }}
                  >
                    {/* <span
                      style={{
                        width: isCalculate ? "33.33%" : "66.66%",
                        cursor: "pointer",
                        display: "block",
                        color: "blue",
                        border: "none",
                      }}
                      onClick={() => {
                        handleActivedropzone({
                          ...activeDropzone,
                          ...{ Id: item.ID, DocTypeId: item.DocTypeId },
                        });
                      }}
                    >
                      {item["ShortName"]}
                    </span>
                    <div style={{borderBottomWidth:1,borderColor:'#999',borderRightWidth:0,margin:'0 -5px'}}></div>
                    {uploadedDocument
                      .filter((item1) => item1.ID == item.ID)
                      .map((item2,index2,arr) => {
                        const isEven = index2 % 2 === 0;
                        const backgroundColor = isEven ? "#f0f0f0" : "#ffffff";
                        return (
                          <>
                            <span
                              style={{
                                width: isCalculate ? "33.33%" : "66.66%",
                                cursor: "pointer",
                                display: "block",
                                color: "blue",
                                border: "none",
                              }}
                              onClick={() => {
                                handleActivedropzone(
                                  {
                                    ...activeDropzone,
                                    ...{
                                      Id: item.ID,
                                      DocTypeId: item.DocTypeId,
                                    },
                                  },
                                  undefined,
                                  undefined,
                                  item2.ScanDocId
                                );
                              }}
                            >
                              {item2.FileName}
                            </span>
                            {arr.length-1 != index2 && <div style={{borderBottomWidth:1,borderColor:'#999',borderRightWidth:0,margin:'0 -5px'}}></div>}
                          </>
                        );
                      })}*/}
                    <table className="innerTable">
                      {/* <tr style={{cursor:"pointer"}}
                        onClick={() => {
                          handleActivedropzone({
                            ...activeDropzone,
                            ...{ Id: item.ID, DocTypeId: item.DocTypeId },
                          });
                        }}
                      >
                        {item["ShortName"]}
                      </tr> */}
                      {uploadedDocument
                        .filter(
                          (item1) =>
                            item1.ID == item.ID &&
                            item1.DocTypeId == item.DocTypeId
                        )
                        .map((item2, index2, arr) => {
                          console.log(item2.ScanDocId, + ' ' + activeDropzone.Id)
                          return (
                            <tr
                              style={{ cursor: "pointer",  backgroundColor: item2.ScanDocId == UploadedDocValue ? "yellow" :""}}
                              onClick={() => {
                                handleActivedropzone(
                                  {
                                    ...activeDropzone,
                                    ...{
                                      Id: item.ID,
                                      DocTypeId: item.DocTypeId,
                                    },
                                  },
                                  undefined,
                                  undefined,
                                  item2.ScanDocId
                                );
                              }}
                            >
                              <p  style={{ cursor: "pointer" }}>
                                {item2.FileName?.toLowerCase().endsWith(".pdf")
                                  ? item2.FileName
                                  : `${item2.FileName}.Pdf`}
                              </p>
                            </tr>
                          );
                        })}
                    </table>
                  </span>

                  {/* {isCalculate? (
                    <span id="spnMonthlyIncomeMain">{""}</span>
                  ) : (
                    isCalculate && <span id="">{""}</span>
                  )} */}
                </div>
              ))}
              {isCalculate && (
                <>
                  <div className="ifooter" style={{ fontWeight: 800 }}>
                    <span>Income Calculation</span>
                  </div>
                  <div className="ifooter">
                    <span>Uploaded</span>
                    <span>Required Documents</span>
                    <span>Calculated Amounts</span>
                  </div>
                  <div className="ifooter">
                    <span></span>
                    <span>30 days of Paystubs</span>
                    <span className="ifooter" id="spnMonthlyIncomeMain"></span>
                  </div>
                  <div className="ifooter">
                   {W2Exists? <span>Yes</span> : <span>No</span> }  
                    <span>W-2</span>
                    <span></span>
                  </div>
                  <div className="ifooter">
                  {VOEExists? <span>Yes</span> : <span>No</span> } 
                    <span>VOE</span>
                    <span></span>
                  </div>
                  <div className="ifooter">
                  {TaxReturnExists? <span>Yes</span> : <span>No</span> } 
                    <span>2022 Tax Return</span>
                    <span></span>
                  </div>
                 
                    
                
                </>
              )}

              {(isCalculate ||
                (group[0]["DocType"] &&
                  group[0]["DocType"].toLowerCase().includes("condition"))) && (
                <div className="ifooter">
                  <span>
                    <Fragment>
                      {/* <Stack spacing={2} direction="row"> */}
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          debugger;
                          fnCheckConditionalRemainingModel();
                          console.log("Prop=", group[0]);
                          setConditionDetails(group[0]);
                        }}
                        style={{
                          cursor: "pointer",
                          color: "#fff",
                          backgroundColor: "#428bca",
                          marginLeft: 2,
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
                      {/* </Stack> */}
                      {/* {props.DocTypeId === 169 && (
                        <>
                          {IncomeCalcProgres && (
                            <div>
                              <CircularProgress
                                size={15}
                                style={{ margin: "0px 5px 0px 15px" }}
                              />
                              <span
                                style={{
                                  verticalAlign: "top",
                                  fontSize: "12px",
                                }}
                              >
                                {" "}
                                Income Calculating...
                              </span>
                            </div>
                          )}
                          <span id="spnMonthlyIncomeMain"></span>
                        </>
                      )} */}
                    </Fragment>
                  </span>
                  {isCalculate && (
                    <>
                      {" "}
                      <span style={{ fontWeight: 800 }} className="ifooter">
                        Total Calculated Amounts
                      </span>
                      <span id="TotalspnMonthlyIncomeMain" className="ifooter">
                        {""}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConditionalTable;
