import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';




const DocTypeAhead = (props) => {   
    const {options, onChange, selectedOption, placeholder, label="", labelKey = "name"} = props;
    console.log("Options====", options)
    return (
      <>        
        <Form.Group className="mt-3">
            {label &&
          <Form.Label>{label}</Form.Label>}
          <Typeahead
            id="basic-typeahead-multiple"
            labelKey={labelKey}
            multiple
            onChange={onChange}
            options={options}
            placeholder=""
            selected={selectedOption}
          />
        </Form.Group>
      </>
    );
  };

  export default DocTypeAhead;