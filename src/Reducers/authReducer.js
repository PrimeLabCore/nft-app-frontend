let initialvalue = {
  user: null,
  jwt: null,
  signupEmail: "",
  signupPhone: "",
  nft: null,
  redirectUrl: null,
  contacts: [],
  otp_medium: "",
};

const authReducer = (state = initialvalue, action) => {
  switch (action.type) {
    case "auth/logout":
      return {
        ...state,
        user: null,
        jwt: null,
      };
    case "auth/set_session":
      return {
        ...state,
        user: action.payload.user,
        jwt: action.payload.jwt,
      };

    case "login_Successfully":
      return {
        ...state,
        user: action.payload,
      };

    case "set_signup_email":
      return {
        ...state,
        signupEmail: action.payload,
      };
    case "set_signup_phone":
      return {
        ...state,
        signupPhone: action.payload,
      };
    case "current_selected_nft":
      return {
        ...state,
        nft: action.payload,
      };
    case "update_redirectUrl":
      return {
        ...state,
        redirectUrl: action.payload,
      };

    case "update_contacts":
      return {
        ...state,
        contacts: action.payload,
      };

    case "set_otp_medium":
      return {
        ...state,
        otp_medium: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
