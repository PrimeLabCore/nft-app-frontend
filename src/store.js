import { createStore } from "redux";
import RootReducer from "./Reducers";

const store = createStore(RootReducer);
export default store;
