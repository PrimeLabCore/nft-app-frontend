let initialvalue = false;

const handleCreateNftClick = (state = initialvalue,action) => {
    switch (action.type) {
        case "createnft__open":
            return true;

        case "createnft__close":
            return false;

        default:
            return state;
    }
}
export default handleCreateNftClick;