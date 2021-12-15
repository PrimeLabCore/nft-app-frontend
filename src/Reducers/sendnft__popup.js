let initialvalue = false;

const handleSendNftPopup = (state = initialvalue, action) => {
  switch (action.type) {
    case "sendnft__open":
      return true;

    case "sendnft__close":
      return false;
    default:
      return state;
  }
};
export default handleSendNftPopup;
