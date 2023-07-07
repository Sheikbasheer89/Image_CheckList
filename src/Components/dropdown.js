import React from "react";
import Select from "react-select";

const options = [
  { value: "Option 1", label: "Option 1" },
  { value: "Option 2", label: "Option 2" },
  { value: "Option 3", label: "Option 3" },
  { value: "Option 4", label: "Option 4" },
];

const Dropdown = () => {
  const formatOptionLabel = ({ value, label }) => {
    const highlightedWord = "2"; // Specify the word you want to highlight
    const parts = label.split(new RegExp(`(${highlightedWord})`, "gi"));
    return (
      <span>
        {parts.map((part, index) => (
          <span
            key={index}
            style={
              part.toLowerCase() === highlightedWord.toLowerCase()
                ? { backgroundColor: "yellow" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return <Select options={options} formatOptionLabel={formatOptionLabel} />;
};

export default Dropdown;
