import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

function MenuOptions(props) {
  let { title, Options } = props;
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={title}
      className="buttonMenuGroup"
    >
      {Options.map((item, index) => (
        <Dropdown.Item
          onClick={() => {
            item.click();
          }}
        >
          {item.title}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default MenuOptions;
