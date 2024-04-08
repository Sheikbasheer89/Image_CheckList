import React, { useState, useEffect, useRef } from "react";

import Select, { components } from "react-select";

export default function DropDownWithSearch(props) {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState(
    Number(props.selectedVal)
  );
  const selectRef = useRef(null);
  const [inputvalues, setinputvalues] = useState("");
  const [focusInput, setfocusInput] = useState(false);
  // Array of all options
  // const optionList = [
  //   props.options
  // ];

  const inputRef = useRef(null);

  const handleBlurAndFocus = () => {
    // Blur the input
    inputRef.current.blur();

    // Wait for a very short time (e.g., 10 milliseconds) before focusing again
    // setTimeout(() => {
    //   inputRef.current.focus();
    // }, 10);
  };

  const mappedOptions = props.options.map((option) => ({
    value: option.Id,
    label: option.DocType,
  }));
  // setOptionList(mappedOptions);

  // Function triggered on selection
  function handleSelect(data) {
    debugger;

    setSelectedOptions(data);
    props.handleChange(data);
    handleBlurAndFocus();
// setTimeout(() => {
//   document.getElementById('btnDummy').focus()
//   // setTimeout(() => {
//   //   document.getElementById('react-select-2-input').focus()
    
//   // }, 100);
// }, 100);

    // console.log('inputvalues',selectRef.current);
    
   
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ccc",

      boxShadow: state.isFocused ? "0 0 0 1px #ccc" : "none",
      "&:hover": {
        borderColor: "#ccc",
      },
      fontSize: "10px !important",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "10px !important", // Adjust the font size of the selected value
    }),
  };

  useEffect(() => {
    // console.log(inputvalues);
    // setinputvalues(selectedOptions.label);
  }, [selectedOptions]);

  useEffect(() => {
    console.log('inputvalues',inputvalues);
    // setinputvalues(selectedOptions.label);
  }, [inputvalues]);

  useEffect(() => {
    if (props.selectedVal) {
      const defaultOption = mappedOptions.find(
        (option) => option.value === Number(props.selectedVal)
      );
      setSelectedOptions(defaultOption);
      // setinputvalues(defaultOption.label);
      inputRef.current.value = ""
    }
  }, [props.selectedVal]);

  const handleInputChange = (inputValue) => {
    // debugger;
    setinputvalues(inputValue);
    inputRef.current.value = inputValue
  };

  return (
    <div className="form-group divInputWrapper">
      <label>{props.cntrllabel}</label>
      <Select
      isClearable={!false}
        options={mappedOptions}
        value={selectedOptions}
        onChange={handleSelect}
        isSearchable={true}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
          },
        })}
        onInputChange={handleInputChange}
        inputValue={inputvalues || inputRef?.current?.value || ""}
        ref={inputRef}
        onFocus={() => {
          // console.log('inputvalues  selectedOptions.label',selectedOptions.label);
          setinputvalues(selectedOptions?.label||'');
          debugger;
          inputRef.current.value = selectedOptions?.label||''
        }}
        onBlur={() => {
          
          setinputvalues("");
          inputRef.current.value = "";
        }}
      />
    </div>
  );
}
