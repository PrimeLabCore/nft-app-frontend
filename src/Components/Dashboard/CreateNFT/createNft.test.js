/* eslint-disable no-undef */
import React from "react";
import axios from "axios";
import {
  render, cleanup, fireEvent, waitFor
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import MockAdapter from "axios-mock-adapter";
import { ToastContainer } from "react-toastify";
import CreateNft from "./createNft";
import { API_BASE_URL } from "../../../Utils/config";
import Reducers from "../../../Reducers";

const mockedUploadedFile = {
  0: {
    lastModified: 1548235678000,
    lastModifiedDate: null,
    name: "13660011.JPG",
    size: 2331918,
    type: "image/jpeg",
    webkitRelativePath: "",
  },
};

const body = new FormData();
body.append("file", mockedUploadedFile);
const nftDetail = {
  action_type: "mine",
  attributes: [{}],
  category: "Digital Arts",
  description: "test description",
  owner_id: "M7WRcmK56Js4B_zEPho7F",
  title: "test title",
  tracker: undefined,
};

body.append("data", JSON.stringify(nftDetail));

const renderWithRedux = (
  component,
  { initialState, store = createStore(Reducers, initialState) } = {}
) => ({
  ...render(<Provider store={store}>{component}</Provider>),
  store,
});

const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

afterEach(cleanup);

describe("createNft", () => {
  test("NFT was minted successfully", async () => {
    global.URL.createObjectURL = jest.fn();

    mock
      .onPost(`${API_BASE_URL}/nfts`)
      .reply(200, { data: { title: "test title" } });

    mock
      .onGet(`${API_BASE_URL}/nfts/list?owner_id=1`)
      .reply(200, { data: [] });

    const { getByTestId, getByText } = renderWithRedux(
      <BrowserRouter>
        <ToastContainer />
        <CreateNft transactionId="123wqe123" />
      </BrowserRouter>,
      {
        initialState: {
          createnft__popup: { initialvalue: true },
          authReducer: { user: { user_id: "1" } },
        },
      }
    );

    // Create NFT form first step
    const fileUploader = getByTestId("file-uploader");

    expect(fileUploader).toBeInTheDocument();
    fireEvent.change(fileUploader, { target: { files: mockedUploadedFile } });

    const nextButton = getByTestId("next-button");

    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    // Create NFT form second step
    const nftTitle = getByTestId("nft-title");
    const nftDescription = getByTestId("nft-description");

    expect(nftTitle).toBeInTheDocument();
    expect(nftDescription).toBeInTheDocument();

    fireEvent.change(nftTitle, { target: { value: "test title" } });
    fireEvent.change(nftDescription, { target: { value: "test description" } });

    const detailsNextButton = getByTestId("details-next-button");
    expect(detailsNextButton).toBeInTheDocument();
    fireEvent.click(detailsNextButton);

    // Create NFT form third step
    const mintNftButton = getByTestId("mint-nft-button");
    expect(mintNftButton).toBeInTheDocument();
    fireEvent.click(mintNftButton);

    // Create NFT form third success screen
    await waitFor(() => getByTestId("success-modal-body"));
    const successModalBody = getByTestId("success-modal-body");
    expect(successModalBody).toBeInTheDocument();

    // Check for success toast
    await waitFor(() => getByText("NFT test title was successfully mined."));
    expect(
      getByText("NFT test title was successfully mined.")
    ).toBeInTheDocument();
  });

  test("NFT was failed to mint", async () => {
    global.URL.createObjectURL = jest.fn();

    mock
      .onPost(`${API_BASE_URL}/nfts`)
      .reply(500, { message: "failed to mint" });

    mock
      .onGet(`${API_BASE_URL}/nfts?user_id=1`)
      .reply(200, { data: { data: {} } });

    const { getByTestId, getByText } = renderWithRedux(
      <BrowserRouter>
        <ToastContainer />
        <CreateNft transactionId="123wqe123" />
      </BrowserRouter>,
      {
        initialState: {
          createnft__popup: { initialvalue: true },
          authReducer: { user: { user_id: "1" } },
        },
      }
    );

    // Create NFT form first step
    const fileUploader = getByTestId("file-uploader");

    expect(fileUploader).toBeInTheDocument();
    fireEvent.change(fileUploader, { target: { files: mockedUploadedFile } });

    const nextButton = getByTestId("next-button");

    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    // Create NFT form second step
    const nftTitle = getByTestId("nft-title");
    const nftDescription = getByTestId("nft-description");

    expect(nftTitle).toBeInTheDocument();
    expect(nftDescription).toBeInTheDocument();

    fireEvent.change(nftTitle, { target: { value: "test title" } });
    fireEvent.change(nftDescription, { target: { value: "test description" } });

    const detailsNextButton = getByTestId("details-next-button");
    expect(detailsNextButton).toBeInTheDocument();
    fireEvent.click(detailsNextButton);

    // Create NFT form third step
    const mintNftButton = getByTestId("mint-nft-button");
    expect(mintNftButton).toBeInTheDocument();
    fireEvent.click(mintNftButton);

    // Check for error toast
    await waitFor(() => getByText("failed to mint"));
    expect(getByText("failed to mint")).toBeInTheDocument();
  });
});
