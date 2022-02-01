import React, { useState } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import PhoneInput, { getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input'
import { makeStyles } from '@material-ui/core/styles'
import TextField from "@mui/material/TextField";
// import Menu from "@mui/material/Menu";
import Autocomplete from '@mui/material/Autocomplete'
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
    '& .MuiMenu-root>.MuiPaper-root': {
      height: '445px !important',
      width: '350px !important'
    },
    "& .MuiAutocomplete-root .MuiFormControl-root": {
      padding: '0 8px'
    },
    "& .MuiAutocomplete-popper": {
      // transform: 'translate(16px, 67px)!important',
      '& .MuiPaper-root': {
        boxShadow: 'none',
      }
    }
  }
})

const CountrySelect = ({ iconComponent, options, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const IconComponent = iconComponent
  return (
    <div className="PhoneInputCountry">
      <div
        style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}
        onClick={(e) => setAnchorEl(open ? null : e.currentTarget)}
      >
        <IconComponent country={props.value} label={props.value} />
        <div className="PhoneInputCountrySelectArrow" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 55,
          left: -10,
          width: 350,
          height: 450,
          background: '#fff',
          zIndex: 99,
          paddingTop: 10,
          opacity: open ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
        }}
      >
        <Autocomplete
          disablePortal
          popupIcon={null}
          options={options}
          autoHighlight
          open
          value={null}
          onChange={(e, v, r) => {
            if (r === 'clear') return
            props.onChange(v.value)
            setAnchorEl(null)
          }}
          clearIcon={null}
          getOptionLabel={(option) => `${option.label} +${getCountryCallingCode(option.value)}`}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
      {/* <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disablePortal
      >
        <div>
          <Autocomplete
            disablePortal
            popupIcon={null}
            options={options}
            autoHighlight
            open
            onChange={(e, v) => {
              props.onChange(v.value)
              setAnchorEl(null)
            }}
            clearIcon={null}
            getOptionLabel={(option) => `${option.label} +${getCountryCallingCode(option.value)}`}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </Menu> */}
    </div>
  )
}

const NumberInput = React.forwardRef(({ onChange, value, ...props }, ref) => {
  const handleChange = e => {
    if (!isValidPhoneNumber(value)) {
      onChange(e)
    } else {
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