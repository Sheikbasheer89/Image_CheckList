import React, { useState, useEffect } from "react";
// import "../Components/bootstrapTable.css";

function ChangeLog(props) {
  let { setChangeLogModalOpen, ChangeLogData } = props;
  if (typeof ChangeLogData === "string")
    ChangeLogData = JSON.parse(ChangeLogData);
  if (ChangeLogData === null || ChangeLogData === undefined) ChangeLogData = [];

  return (
    <div className="modalBackground" style={{ zIndex: 9999 }}>
      <div className="modalContainer" style={{ width: "50%" }}>
        <span style={{ fontSize: "16px", marginBottom: "10px" }}>
          Change Log
        </span>

        <div className="body" style={{ paddingRight: "4px" }}>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tr
                style={{
                  backgroundColor: "#307ecc",
                  color: "#FFF",
                  fontSize: "14px",
                  paddingLeft: "12px",
                  marginBottom: "1px",
                }}
              >
                <th>Value From</th>
                <th>Value To</th>
                <th>User</th>
                <th>Change Date</th>
              </tr>
              <>
                {ChangeLogData.length > 0 ? (
                  <>
                    {ChangeLogData?.map((val, key) => {
                      return (
                        <tr key={key}>
                          <td>{val.OldValue}</td>
                          <td>{val.NewValue}</td>
                          <td>{val.strChangedBy}</td>
                          <td>{val.ModifiedOn}</td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>No Records Found</>
                )}
              </>
            </table>
          </div>
        </div>
        <div className="footer">
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setChangeLogModalOpen(false);
              }}
              id="btnClose"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChangeLog;
