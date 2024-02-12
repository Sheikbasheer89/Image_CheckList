import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { handleAPI } from "./CommonFunction";

import "react-datepicker/dist/react-datepicker.css";

const TableStats = (props) => {
 
  const [data, setData] = useState([]);

  useEffect(() => {
    debugger;
    console.log("props", props);

   
    const fetchData = async () => {

        let idatFrom = new Date(props.idataFrom);

        let idatFromformattedDate = `${idatFrom.getFullYear()}-${(idatFrom.getMonth() + 1).toString().padStart(2, '0')}-${idatFrom.getDate().toString().padStart(2, '0')}`;
    
        let idatTo = new Date(props.idataTo);

        let idatToformattedDate = `${idatTo.getFullYear()}-${(idatTo.getMonth() + 1).toString().padStart(2, '0')}-${idatTo.getDate().toString().padStart(2, '0')}`;


      const response = await handleAPI({
        name: "GetStatisticsDataOCR",
        params: {
          Datefrom: idatFromformattedDate,
          Dateto: idatToformattedDate,
        },
      })
        .then((response) => {
          console.log(response);

          let ParseResponse = JSON.parse(response);

        let tableData = [
            {
              id: 1,
              column1: ParseResponse.Table[0].EndpointReceived,
              column2: "Endpoint Documents Received",
            },
            {
              id: 2,
              column1: ParseResponse.Table[0].EndpointCompleted,
              column2:
                "Endpoint Completed (returned New Document through endpoint)",
            },
            {
              id: 3,
              column1: ParseResponse.Table[0].FeedbackEndpointReceived,
              column2: "Edited Documents Endpoint Received",
            },
            {
              id: 4,
              column1: ParseResponse.Table[0].FeedbackEndpointCompleted,
              column2:
                "Edited Documents Endpoint Returned (Documents Edited that were returned through endpoint)",
            },
            //   { id: 3, column1: '', column2: 'Value 3B' },
            // Add more data as needed
          ];
          setData(tableData);
          props.setisSearched(false);
          console.log(data);
          // setModalOpen(true);
        })
        .catch((error) => {
          ////debugger;
          console.log("error", error);
        });
    };
    fetchData();
  }, [props.isSearched]);

  return (
    <table className="tableWithBorder">
      <thead>
        <tr>
          <th>Quantity</th>
          <th>New Documents</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter((e) => [1, 2].includes(e.id))
          .map((row) => (
            <tr key={row.id}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
            </tr>
          ))}
      </tbody>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Edits</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter((e) => [3, 4].includes(e.id))
          .map((row) => (
            <tr key={row.id}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const StatisticstblView = (props) => {
  return <TableStats {...props} />;
};

export default StatisticstblView;
