import React from "react";
import DropZone from "./DropZone";

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
  let { DocDetails } = props;

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
  console.log("DocDetailsFROMGridView", DocDetails);
  const data = [
    { id: 1, name: "Item 1", Age: 10 },

    { id: 2, name: "Item 2", Age: 10 },

    { id: 3, name: "Item 3", Age: 10 },
  ];

  const columns = ["id", "name", "Age"]; // Define the columns to display

  return (
    <div>
      {DocDetails.map((group, index) => {
        let isCalculate = false
        return (
          <div
            style={{
              borderBottom: "1px solid #999",
              display: "flex",
              flexDirection: "row",
            }}
          >
           
            <div className="table">
              <div className="iheader" style={{fontWeight: 800, }}>{group[0]["DocType"]}</div>
              <div className="iheader">
                <span>Uploaded</span>
                <span style={{ width: isCalculate ?  "33.33%":"66.66%" }}>
                  Required Documents
                </span>
                {isCalculate && <span>Calculated Amounts</span>}
              </div>

              {group.map((item, index) => (
                <div className="body" key={index}>
                  <span> <DropZone
                      typeId={item["DocTypeId"]}
                      label={item["ShortName"]}
                      MultipleProgressbar={item.MultipleProgressbar}
                      {...item}
                      {...props}
                      //   setMultipleProgressbar
                    /> </span>
                  <span style={{ width: isCalculate ?   "33.33%":"66.66%", cursor:"pointer",borderColor:'black' }}>
                    {item["ShortName"]}
                  </span>
                  {isCalculate && <span>{""}</span>}
                </div>
              ))}
              {isCalculate && (
                <div className="ifooter">
                  <span>Uploaded</span>
                  <span style={{ fontWeight: 800 }}>
                    Total Calculated Amounts
                  </span>
                  <span>$15.36</span>
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
