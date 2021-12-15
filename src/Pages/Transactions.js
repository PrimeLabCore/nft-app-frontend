import React from "react";
import { Container } from "react-bootstrap";
import HomeHeader from "../Components/Dashboard/Home/HomeHeader";
import TransactionHistory from "../Components/Dashboard/Transactions/TransactionHistory";

const Transactions = () => {
  return (
    <>
      <Container>
        <HomeHeader />
        <TransactionHistory />
      </Container>
    </>
  );
};
export default Transactions;
