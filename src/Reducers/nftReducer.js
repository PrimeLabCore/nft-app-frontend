let initialState = {
};

export default (state = initialState, action) => {
  switch(action.type) {
    case 'nft/set-tracker':
      return {
        ...state,
        adTracker: action.payload
      };

    default:
      return state;
  }
}
