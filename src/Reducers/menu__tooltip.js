let initialvalue = false;

const handleTooltipClick = (state = initialvalue,action) => {
    switch (action.type) {
        case "toggle":
            return !state

        case "handleTooltipClick__close":
            return false;

        default:
            return state;
    }
}
export default handleTooltipClick;