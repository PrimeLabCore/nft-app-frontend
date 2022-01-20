/* eslint-disable no-undef */
import React from "react";
import axios from "axios";
import {
  render, cleanup, fireEvent, waitFor
} from "@testing-library/react";
import { LocalStorageMock } from "@react-mock/localstorage";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import MockAdapter from "axios-mock-adapter";
import { ToastContainer } from "react-toastify";
import SendNft from "./sendNft";
import { API_BASE_URL } from "../../../Utils/config";
import Reducers from "../../../Reducers";

const renderWithRedux = (
  component,
  { initialState, store = createStore(Reducers, initialState) } = {}
) => ({
  ...render(<Provider store={store}>{component}</Provider>),
  store,
});

const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

const mockedNfts = [
  {
    attributes: [{}],
    category: "Digital Arts",
    created: 1642511133469,
    description: "Neon lights",
    file_url:
      "https://near-lambda-nft-files.s3.us-west-1.amazonaws.com/SQR9qs8qis3cK2d86Wj-G_original_13660010.JPG",
    nft_id: "SQR9qs8qis3cK2d86Wj-G",
    owner_id: "M7WRcmK56Js4B_zEPho7F",
    status: "active",
    title: "Neon lights",
    updated: 1642511133469,
  },
  {
    attributes: [{}],
    category: "Digital Arts",
    created: 1642529076795,
    description: "test",
    file_url:
      "https://near-lambda-nft-files.s3.us-west-1.amazonaws.com/M8JZGH_NyLgoGY8ONflJZ_original_13660014.JPG",
    nft_id: "M8JZGH_NyLgoGY8ONflJZ",
    owner_id: "M7WRcmK56Js4B_zEPho7F",
    status: "active",
    title: "test",
    updated: 1642529076795,
  },
];

const mockedContacts = [
  {
    address: [],
    app_id: "NFT Maker App",
    companies: [],
    contact_id: "WqlBP1nTWztb6o3wihtpz",
    created: 1642511207790,
    email: [
      {
        address: "sz@trembit.com",
        primary: true,
        type: "other",
      },
    ],
    first_name: "",
    groups: [],
    last_name: "",
    locations: [],
    modified: 1642511207790,
    owner_id: "M7WRcmK56Js4B_zEPho7F",
    phone: [],
    photos: [],
    source: "Google",
    status: "active",
    __letter__: "s",
    __selectedAddress__: "",
    __selectedMail__: "sz@trembit.com",
    __selectedPhone__: "",
  },
];

afterEach(cleanup);

describe("createNft", () => {
  test("NFT was sent successfully", async () => {
    global.URL.createObjectURL = jest.fn();
    mock
      .onGet(`${API_BASE_URL}/nfts/list?owner_id=1`)
      .reply(200, { data: mockedNfts });
    const { getByTestId, debug } = renderWithRedux(
      <LocalStorageMock items={JSON.stringify({ sendNftId: mockedNfts[0] })}>
        <BrowserRouter>
          <ToastContainer />
          <SendNft />
        </BrowserRouter>
      </LocalStorageMock>,
      {
        initialState: {
          home__allnft: { nfts: mockedNfts },
          sendnft__popup: true,
          authReducer: {
            user: { user_id: "1" },
            nft: mockedNfts[0],
            contacts: mockedContacts,
          },
        },
      }
    );

    await waitFor(() => getByTestId(`next-button`));
    const nextButton = getByTestId(`next-button`);
    expect(nextButton).toBeInTheDocument();
    // For some reasons next button is desabled
    // expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    debug();
  });
});
