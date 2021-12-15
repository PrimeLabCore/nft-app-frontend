const initialState = false;
const GiftNFT_Dialog_Box = (state = initialState, action) => {
  switch (action.type) {
    case "open_dialog_gift_nft":
      return true;
    case "close_dialog_gift_nft":
      return false;
    default:
      return state;
  }
};
export default GiftNFT_Dialog_Box;
