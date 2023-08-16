import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

export default function MultipleSelectCheckmarks(props) {
  let { handleMultiSelect, value, label, Options, Typevalue, TypeText } = props;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    handleMultiSelect(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div style={{marginLeft: "5px"}}>
      <div className="divSelectWrapper" sx={{ m: 1, width: 300 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          //   labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (selected || []).join(", ")}
          MenuProps={MenuProps}
        >
          {Options.map((item, index) => (
            <MenuItem key={index} value={item[TypeText]}>
              <Checkbox checked={value.indexOf(item[TypeText]) > -1} />
              <ListItemText primary={item[TypeText]} />
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
