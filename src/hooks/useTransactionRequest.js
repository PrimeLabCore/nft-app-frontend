import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { actionFetchTransactions } from "../Store/Transactions/actions";
import { getTransactionByUserId } from "../api/transactions";

const useTransactionRequest = (userId) => {
  const dispatch = useDispatch();
  const allTransactions = useSelector(state => state.transactions.allTransactions);

  const mergeTransactions = (oldTransactions, newTransactions) => {
    const result = [...oldTransactions];
    const oldTransactionsIdList = result.map(item => item.transaction_id);
    newTransactions.forEach(item => {
      if (oldTransactionsIdList.indexOf(item.transaction_id) === -1) {
        result.push(item);
      }
    });
    return result;
  }

  useEffect(async () => {
    const response = await getTransactionByUserId(userId);
    const fetchedTransactions = response.data?.data;

    if (fetchedTransactions) {
      const totalTransactions = mergeTransactions(allTransactions, fetchedTransactions);
      dispatch(actionFetchTransactions(totalTransactions.sort((a, b) => b.created - a.created)));
    }
  }, [userId]);

  return allTransactions;
};

export default useTransactionRequest;
