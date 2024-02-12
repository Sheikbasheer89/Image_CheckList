import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";



const Statistics = (props) => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <DatePicker selected={startDate} onChange={(date) => {setStartDate(date)
        props.onChange(date)
      }} />
      
    </>
  );
};

export default Statistics;
