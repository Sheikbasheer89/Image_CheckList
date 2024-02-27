import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
  options,
  label,
  id,
  text,
  name,
  cntrllabel,
  selectedVal,
  
  handleChange

}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  const optionsRef = useRef(null);

  useEffect(() => {
    if (isOpen && optionsRef.current) {
      optionsRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);
  useEffect(()=>{

    setQuery(selectedVal);

  }, [selectedVal])
  const selectOption = (option) => {
    // setQuery(() => "");
    setQuery(option.DocType);
    handleChange(option);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label]?.toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="dropdown form-group divInputWrapper">
      <div className="control">
        <div className="selected-value">
        <label>{cntrllabel}</label>
          <input
            ref={inputRef}
            type="text"
            value={query}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value);
            //   handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdown;
