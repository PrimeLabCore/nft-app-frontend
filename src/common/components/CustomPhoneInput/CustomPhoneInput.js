import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function CustomPhoneInput({
  setCountry,
  setinputFields,
  countryValue,
  signUp,
  placeholder,
  HandelKeyPress,
  value,
  height,
  onFocus,
  onChange,
  className,
  containerStyle = {}
}) {
  return (
    <PhoneInput
      onFocus={onFocus}
      onChange={(fieldValue, country) => {
        onChange && onChange({ target: { value: fieldValue } });

        signUp && setCountry(country);

        if (countryValue && country?.name !== countryValue?.name) {
          setinputFields({ phone: `+${country?.dialCode}` });
        }
      }}
      value={value}
      placeholder={placeholder}
      containerStyle={{
        height: height || "56px",
        borderRadius: "10px",
        backgroundColor: "#f7f7f7",
        ...containerStyle
      }}
      onKeyDown={HandelKeyPress}
      buttonStyle={{ borderRadius: " 10px 0 0 10px " }}
      inputStyle={{
        width: "100%",
        height: "56px",
        borderRadius: "10px",
        backgroundColor: "#f7f7f7"
      }}
      containerClass={className}
      country="us"
    />
  );
}
export default CustomPhoneInput;
