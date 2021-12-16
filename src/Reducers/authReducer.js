let initialvalue = {
  user: null,
  signupEmail: "",
  signupPhone: "",
  nft: null,
  redirectUrl: null,
};

const authReducer = (state = initialvalue, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};
export default authReducer;
