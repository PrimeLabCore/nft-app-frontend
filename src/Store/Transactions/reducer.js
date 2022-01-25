import { FETCH_TRANSACTIONS, ADD_TRANSACTION } from "./actionTypes";

const initialValue = {
  allTransactions: [],
};

const transactionsReducer = (state = initialValue, action) => {
  switch (action.type) {
    case FETCH_TRANSACTIONS:
      return {
        ...state,
        allTransactions: action.payload,
      };
    case ADD_TRANSACTION:
      return {
        ...state,
        allTransactions: [...state.allTransactions, action.payload],
      };
    default:
      return state;
  }
};
export default transactionsReducer;
