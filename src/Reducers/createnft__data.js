let initialvalue = [];

const CreateNFTData = (state = initialvalue,action) => {
    switch (action.type) {
        case "createnftdata__store":
            return [...state,action.payload];

        case "createnftdata__override":
            return [action.payload];
        default:
            return state;
    }
}
export default CreateNFTData;