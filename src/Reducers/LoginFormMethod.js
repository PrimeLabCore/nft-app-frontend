const initialState = "email";

const LoginFormMethod = (state = initialState, action) => {
  switch (action.type) {
    case "email":
      return "email";

    case "phone":
      return "phone";

    default:
      return state;
  }
};
export default LoginFormMethod;
