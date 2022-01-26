import React from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input'
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

const CountrySelect = ({ iconComponent, options, ...props }) => {
  const IconComponent = iconComponent
  return (
    <div className="PhoneInputCountry">
      <select className="PhoneInputCountrySelect" {...props} onChange={(e) => props.onChange(e.target.value)}>
        {options.map(item => (
          <option key={item.value} value={item.value}>
            {`${item.label}  +${getCountryCallingCode(item.value)}`}
          </option>
        ))}
      </select>
      <IconComponent country={props.value} label={props.value} />
      <div className="PhoneInputCountrySelectArrow" />
    </div>
  )
}

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
      countrySelectComponent={CountrySelect}
      numberInputProps={{ style: { height: height || '42px' } }}
      className={`${className} ${classes.baseInput} form-control`}
      onChange={handleChange}
      onKeyDown={HandelKeyPress}
    />
  );
}
export default CustomPhoneInput;
