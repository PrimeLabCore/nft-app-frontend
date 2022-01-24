import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import React from "react";

const GetStartedButton = () => (
  <Link to="/signup">
    <button>
      Get Started
      {' '}
      <span><IoIosArrowForward /></span>
    </button>
  </Link>
);

export default GetStartedButton;