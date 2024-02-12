import { Form } from "react-bootstrap";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const DocTypeAhead = (props) => {
  const {
    options,
    onChange,
    selectedOption,
    placeholder,
    label = "",
    labelKey = "name",
    onKeyDown,
  } = props;
  console.log("Options====", options)
  return (
    <>
      <Form.Group className="mt-3">
        {label && <Form.Label>{label}</Form.Label>}
        <Typeahead
          id="basic-typeahead-multiple"
          onKeyDown={onKeyDown}
          labelKey={labelKey}
          multiple
          onChange={onChange}
          options={options}
          placeholder=""
          selected={selectedOption}
          renderMenu={(results, menuProps) => (
            <Menu {...menuProps}>            
              {results.map((result, index) => (
                <MenuItem option={result} position={index} title={result[labelKey]} >                  
                  {result[labelKey]}
                </MenuItem>
              ))}
            </Menu>
          )}
        />
      </Form.Group>
    </>
  );
};

export default DocTypeAhead;
