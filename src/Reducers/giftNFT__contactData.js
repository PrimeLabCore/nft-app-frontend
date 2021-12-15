let initialvalue = [];

const GoogleContactData = (state = initialvalue,action) => {
    switch (action.type) {
        case "getGoogleContactData":
            return [...action.payload]; //We spread the last state because this is a pure reducer function meaning every time we call it, it will return a new state so ...state means it will not forget the old state if the function is called again

        default:
            return state;
    }
}
export default GoogleContactData;