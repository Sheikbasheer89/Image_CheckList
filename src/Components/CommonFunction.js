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
  const { label, onChange, ResJSON, name } = props;

  return (
    <>
      <div className="form-group divInputWrapper">
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
  const { label, onChange, value, text, SelectedVal, name, fnValueChange } =
    props;
  let { options } = props;
  options = [...[{ [text]: "Select", [value]: "0" }], ...options];
  console.log(SelectedVal);
  return (
    <>
      <div className="form-group divInputWrapper">
        <label>{label}</label>
        <select
          defaultValue={SelectedVal || null}
          className={`form-control ${
            parseInt(SelectedVal) === 0 ? "RedBorder" : null
          }`}
          onChange={fnValueChange || null}
          name={name}
        >
          {options.map((item, index) => (
            <option key={index} value={item[value]}>
              {item[text]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export { handleAPI, FormatPhoneLogin, TextBox, DropDown };
