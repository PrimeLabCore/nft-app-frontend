import axios from "axios";
import CreateNft from "./createNft";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { API_BASE_URL } from "../../../Utils/config";
import { createStore } from "redux";
import Reducers from "../../../Reducers";
import { MockAdapter } from "axios-mock-adapter";

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

let body = new FormData();
body.append("file", mockedUploadedFile);
// nftData.append("data", JSON.stringify(nftDetail));

const renderWithRedux = (
  component,
  { initialState, store = createStore(Reducers, initialState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

afterEach(cleanup);

describe("createNft", () => {
  test("NFT was minted successfully", async () => {
    global.URL.createObjectURL = jest.fn();

    mock.onPost();

    const { getByTestId, debug } = renderWithRedux(
      <BrowserRouter>
        <CreateNft transactionId="123wqe123" />
      </BrowserRouter>,
      {
        initialState: {
          createnft__popup: { initialvalue: true },
          authReducer: { user: { user_id: "1" } },
        },
      }
    );

    //Create NFT form first step
    const fileUploader = getByTestId("file-uploader");

    expect(fileUploader).toBeInTheDocument();
    fireEvent.change(fileUploader, { target: { files: mockedUploadedFile } });

    const nextButton = getByTestId("next-button");

    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    //Create NFT form second step
    const nftTitle = getByTestId("nft-title");
    const nftDescription = getByTestId("nft-description");

    expect(nftTitle).toBeInTheDocument();
    expect(nftDescription).toBeInTheDocument();

    fireEvent.change(nftTitle, { target: { value: "test title" } });
    fireEvent.change(nftDescription, { target: { value: "test description" } });

    const detailsNextButton = getByTestId("details-next-button");
    expect(detailsNextButton).toBeInTheDocument();
    fireEvent.click(detailsNextButton);

    //Create NFT form third step
    const mintNftButton = getByTestId("mint-nft-button");
    expect(mintNftButton).toBeInTheDocument();
    fireEvent.click(mintNftButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    // expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/nfts`);
  });
});
