import React from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

const CustomPhoneInput = ({placeholder, HandelKeyPress, value, height, onFocus, onChange, className}) => {

    return (
        <>
            <PhoneInput
                onFocus={onFocus}
                onChange={(value) => onChange && onChange({target: {value}})}
                value={value}
                placeholder={placeholder}
                containerStyle={{
                    height: height || "56px",
                    borderRadius: "10px",
                    backgroundColor: "#f7f7f7",
                }}
                onKeyDown={HandelKeyPress}
                buttonStyle={{borderRadius: " 10px 0 0 10px "}}
                inputStyle={{
                    width: "100%", height: "56px",
                    borderRadius: "10px",
                    backgroundColor: "#f7f7f7"
                }}
                containerClass={className}
                country={'us'}
            />
        </>
    );
};
export default CustomPhoneInput;
