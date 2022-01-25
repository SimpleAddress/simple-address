import { NULL_ADDRESS } from "../utils/constant";
import { USER_CONNECTED } from "./SImpleAddressConstants";

const initialState = {
    user: {
        address: NULL_ADDRESS
    }
}

const SimpleAddressReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_CONNECTED:
            return {
                ...state,
                user: { address: action.payload }
            }
        default:
            return state
    }
}

export default SimpleAddressReducer;