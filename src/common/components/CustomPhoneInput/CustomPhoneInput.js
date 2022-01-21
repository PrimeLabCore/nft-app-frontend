import React from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { makeStyles } from '@material-ui/core/styles'

const useCustomPhoneInputStyle = makeStyles({
  baseInput: {
    borderRadius: 10,
    margin: '10px 0',
    background: 'rgba(0, 0, 0, 0.03)',
    border: '1px solid #BDBDBD',
    '& input': {
      border: 'none',
      outline: 'none',
      '&:focus, &:active, &:hover': {
        border: 'none',
        outline: 'none',
        paddingLeft: 5,
        borderLeft: '1px solid #BDBDBD'
      },
      paddingLeft: 5,
      borderLeft: '1px solid #BDBDBD'
    },
  }
})

function CustomPhoneInput({
  placeholder,
  HandelKeyPress,
  value,
  height,
  onFocus,
  onChange,
  className,
}) {
  const classes = useCustomPhoneInputStyle();
  const handleChange = fieldValue => {
    onChange && onChange({ target: { value: fieldValue ?? value } });
  }

  return (
    <PhoneInput
      international
      onFocus={onFocus}
      defaultCountry="US"
      placeholder={placeholder}
      countryCallingCodeEditable={false}
      value={value}
      limitMaxLength
      numberInputProps={{ style: { height: height || '42px' } }}
      className={`${className} ${classes.baseInput} form-control`}
      onChange={handleChange}
      onKeyDown={HandelKeyPress}
    />
  );
}
export default CustomPhoneInput;
