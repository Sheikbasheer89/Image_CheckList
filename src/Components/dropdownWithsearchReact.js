import React, { useState, useEffect } from "react";

import Select from "react-select";

export default function DropDownWithSearch(props) {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState(Number(props.selectedVal));
  
  // Array of all options
  // const optionList = [
  //   props.options
  // ];

  const mappedOptions = props.options.map((option) => ({
    value: option.Id,
    label: option.DocType
  }));
  // setOptionList(mappedOptions);

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
    props.handleChange(data);
  }

  const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #ccc" : "none",
    "&:hover": {
      borderColor: "#ccc"
    }
  }),
  indicatorSeparator: () => ({
    display: "none"
  })
};

  useEffect(() => {
    if (props.selectedVal) {
      const defaultOption = mappedOptions.find(
        (option) => option.value === Number(props.selectedVal)
      );
      setSelectedOptions(defaultOption);
    }
  }, []);
  return (
   
   
      
      <div className="form-group divInputWrapper">
        <label>{props.cntrllabel}</label>
        <Select
          options={mappedOptions}          
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true} 
          styles={customStyles}   

        />
      </div>
    
  );
}