let initialvalue = {
  allTransactions: [],
};

const transactionsReducer = (state = initialvalue, action) => {
  switch (action.type) {
    case "fetch_transactions":
      return {
        ...state,
        allTransactions: action.payload,
      };

    case "add_transaction":
      return {
        ...state,
        allTransactions: [...state.allTransactions, action.payload],
      };
    default:
      return state;
  }
};
export default transactionsReducer;
