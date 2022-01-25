import { FETCH_TRANSACTIONS, ADD_TRANSACTION } from "./actionTypes";

export const actionFetchTransactions = payload => ({
  type: FETCH_TRANSACTIONS,
  payload
});

export const actionAddTransaction = payload => ({
  type: ADD_TRANSACTION,
  payload
})