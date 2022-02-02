import React, { useState, useRef } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import PhoneInput, { getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input'
import { makeStyles } from '@material-ui/core/styles'
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete'
import ClickAwayListener from "@mui/material/ClickAwayListener";
import 'react-phone-number-input/style.css'

const useCustomPhoneInputStyle = makeStyles({
  baseInput: {
    borderRadius: 10,
    margin: '10px 0',
    background: 'rgba(0, 0, 0, 0.03)',
    border: '1px solid #BDBDBD',
    '& .PhoneInputInput': {
      border: 'none',
      outline: 'none',
      background: 'rgba(0, 0, 0, 0)',
      '&:focus, &:active, &:hover': {
        border: 'none',
        outline: 'none',
        paddingLeft: 5,
        borderLeft: '1px solid #BDBDBD'
      },
      paddingLeft: 5,
      borderLeft: '1px solid #BDBDBD'
    },
    '& legend': {
      width: 0
    },
    "& .MuiAutocomplete-root .MuiFormControl-root": {
      padding: '0 8px'
    },
    "& .MuiAutocomplete-popper": {
      inset: '0px auto auto 0px !important',
      transform: 'translate(8px, 66px) !important',
      '& .MuiPaper-root': {
        boxShadow: 'none',
      }
    },
    "& .flag-wrapper": {
      display: "flex",
      alignItems: "center",
      cursor: 'pointer'
    },
    "& .autocomplete-wrapper": {
      position: 'absolute',
      top: 55,
      left: -10,
      width: 350,
      height: 450,
      background: '#fff',
      zIndex: 99,
      paddingTop: 10,
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    }
  }
})

const CountrySelect = ({ iconComponent: IconComponent, options, ...props }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open)
  }

  const handleChange = (e, v, r) => {
    if (r === 'clear') return
    props.onChange(v.value)
    setOpen(false)
  }

  return (
    <div className="PhoneInputCountry">
      <div onClick={handleClick} className="flag-wrapper">
        <IconComponent country={props.value} label={props.value} />
        <div className="PhoneInputCountrySelectArrow" />
      </div>

      {open && (
        <ClickAwayListener onClickAway={handleClick}>
          <div className="autocomplete-wrapper">
            <Autocomplete
              open
              autoHighlight
              disablePortal
              clearIcon={null}
              popupIcon={null}
              value={null}
              options={options}
              onChange={handleChange}
              getOptionLabel={(option) => `${option.label} +${getCountryCallingCode(option.value)}`}
              renderInput={(params) => <TextField {...params} autoFocus />}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  )
}

const NumberInput = React.forwardRef(({ onChange, value, ...props }, ref) => {
  const isValidGotten = useRef(false)
  const handleChange = e => {
    const isNumValid = isValidPhoneNumber(e.target.value)
    if (isNumValid) {
      onChange(e)
      isValidGotten.current = true
    } else if (!isValidGotten.current && !isNumValid) {
      onChange(e)
    } else {
      isValidGotten.current = isValidPhoneNumber(value)
      return false
    }
  }

  const handlePaste = e => {
    const clipboardNumber = e.clipboardData.getData('Text')
    const number = e.target.value + clipboardNumber
    isValidPhoneNumber(number) || isValidPhoneNumber(clipboardNumber) ? null : e.preventDefault()
  }

  return (
    <input
      ref={ref}
      onChange={handleChange}
      value={value}
      onPaste={handlePaste}
      {...props}
    />
  )
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
    onChange && onChange({ target: { value: fieldValue ?? "" } });
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
      inputComponent={NumberInput}
      onKeyDown={HandelKeyPress}
    />
  );
}
export default CustomPhoneInput;