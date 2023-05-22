import FeedTwoToneIcon from "@mui/icons-material/FeedTwoTone";

const handleAPI = async ({ name, params, method }) => {
  params = Object.keys(params)

    .map((key) => `${key}=${params[key]}`)

    .join("&");

  return fetch(
    `https://www.solutioncenter.biz/LoginCredentialsAPI/api/${name}?${params}`,

    {
      method: method || "POST",
      crossDomain: true,

      headers: {
        Accept: "application/json",

        "Content-Type": "application/json",
      },
    }
  )
    .then(function (response) {
      return response.json();
    })

    .catch(function (err) {
      console.log(`Error: ${err}`);
    });
};

const FormatPhoneLogin = (PhoneNo) => {
  if (PhoneNo !== "") {
    PhoneNo = PhoneNo.replaceAll("-", "");

    PhoneNo = PhoneNo.replaceAll("(", "");

    PhoneNo = PhoneNo.replaceAll(")", "");

    PhoneNo = PhoneNo.replaceAll(" ", "");

    if (
      PhoneNo.indexOf("@") === -1 &&
      Number(PhoneNo) &&
      PhoneNo.length === 10
    ) {
      PhoneNo = PhoneNo.replace(/D/g, "");

      if (PhoneNo.length < 10) {
        return PhoneNo;
      }

      let p = /^([\d]{3})([\d]{3})([\d]{4,})$/.exec(PhoneNo);

      PhoneNo = "(" + p[1] + ") " + p[2] + "-" + p[3];

      return PhoneNo;
    }
  }

  return PhoneNo;
};

const TextBox = (props) => {
  const {
    label,
    onChange,
    ResJSON,
    name,
    onMouseHover = () => {},
    onMouseLeave,
  } = props;

  return (
    <>
      <div
        className="form-group divInputWrapper"
        onMouseEnter={(e) => {
          onMouseHover(e, ResJSON[name]);
        }}
        onMouseLeave={onMouseLeave}
      >
        <label>{label}</label>
        <input
          type="text"
          class="form-control"
          onChange={onChange || null}
          name={name || null}
          value={ResJSON !== [] ? ResJSON[name] : ""}
          placeholder={label}
          style={{ width: "95%", display: "inline-block" }}
        />
        <span onClick={() => {}} style={{ cursor: "pointer", zIndex: 111 }}>
          <FeedTwoToneIcon
            style={{
              verticalAlign: "bottom",
              color: "#999",
              cursor: "pointer",
            }}
          ></FeedTwoToneIcon>
        </span>
      </div>
    </>
  );
};

const DropDown = (props) => {
  let {
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
  } = props;

  if (props.fromBorrEntityExists === "1") {
    options = [
      ...[{ [text]: "Create as New Borrower", [value]: "-1" }],
      ...options,
    ];
  }
  if (props.fromBorrEntityExists === "2") {
    options = [
      ...[{ [text]: "Create as New Entity", [value]: "-1" }],
      ...options,
    ];
  }
  if (isIncludeSelect) {
    options = [...[{ [text]: "Select", [value]: "0" }], ...options];
  }

  return (
    <>
      <div className="form-group divInputWrapper" style={style}>
        <label>{label}</label>
        <select
          value={SelectedVal || null}
          className={`form-control ${
            parseInt(SelectedVal) === 0 && validationRequired
              ? "RedBorder"
              : null
          }`}
          onChange={onChange || null}
          name={name}
          style={SelectSytle}
        >
          {options.map(
            (item, index) =>
              item[value] &&
              item[text] && (
                <option key={index} value={item[value]}>
                  {item[text]}
                </option>
              )
          )}
        </select>
      </div>
    </>
  );
};

const InputBox = (props) => {
  const { label, name, value, disabled = false, style = {}, onChange } = props;

  return (
    <>
      <div className="form-group divInputWrapper" style={style}>
        <label style={{ fontSize: "11px" }}>{label}</label>
        <input
          type="text"
          class="form-control"
          onChange={onChange || null}
          name={name || null}
          value={value || ""}
          placeholder={label}
          style={{ fontSize: "11px" }}
          // style={{ width: "95%", display: "inline-block" }}
        />
      </div>
    </>
  );
};

export { handleAPI, FormatPhoneLogin, TextBox, DropDown, InputBox };
