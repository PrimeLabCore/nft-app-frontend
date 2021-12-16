let initialvalue = [];

const AllNFT = (state = initialvalue, action) => {
  switch (action.type) {
    case "getNft":
      return action.payload.sort((a,b)=>b.id > a.id ? 1: -1); //We spread the last state because this is a pure reducer function meaning every time we call it, it will return a new state so ...state means it will not forget the old state if the function is called again
    case "addNewNft":
      return [action.payload,...state];
    default:
      return state;
  }
};
export default AllNFT;
