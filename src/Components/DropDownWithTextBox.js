import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import FeedTwoToneIcon from "@mui/icons-material/FeedTwoTone";

const Label = styled("label")({
  display: "block",
});

const Input = styled("input")(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  color: theme.palette.mode === "light" ? "#000" : "#fff",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: 200,
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

export default function CustomInputAutocomplete(props) {
  const {
      label,
      onChange,
      value,
      text,
      SelectedVal,
      name,
      style = {},
      validationRequired = true,
      options = [],
      SelectSytle = {},
      isIncludeSelect = true,
      onBlur = () => {},
    } = props,
    [iValue, setIValue] = React.useState(SelectedVal),
    inputRef = React.useRef();
  // React.useEffect(() => {
  //   let arr = options.filter((item) => item[value] == SelectedVal);
  //   if (arr.length > 0) inputRef.current.value=(arr[0][text]);
  // }, [SelectedVal]);

  return (
    <div>
      <div
        className="form-group divInputWrapper"
        // onMouseEnter={(e) => {
        //   onMouseHover(e, ResJSON[name]);
        // }}
        // onMouseLeave={onMouseLeave}
      >
        <label>{label}</label>
        <Autocomplete
          sx={{
            display: "inline-block",
            width: "95%",
            "& input": {
              bgcolor: "background.paper",
              color: "#0000000a",
            },
          }}
          // id="custom-input-demo"
          onChange={onChange}
          options={options.map((item) => item["Name"])}
          renderInput={(params) => {
            return <div ref={params.InputProps.ref}>
              <span
                style={{
                  position: "absolute",
                  fontSize: "10px",
                  top: "20px",
                  left: "25px",
                }}
              >
                {iValue}
              </span>

              <input
                type="text"
                {...params.inputProps}
                className="form-control"
              />
            </div>
          }
           
          }
        />

        <span onClick={() => {}} style={{ cursor: "pointer", zIndex: 111 }}>
          <FeedTwoToneIcon
            style={{
              verticalAlign: "bottom",
              color: "#999",
              cursor: "pointer",
            }}
            onClick={() => {
              // GetAPIChangeLog(LoanId, DbFieldId, ScanDocId);
            }}
          ></FeedTwoToneIcon>
        </span>
      </div>
    </div>
  );
}
