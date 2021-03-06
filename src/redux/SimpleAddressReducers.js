import { NULL_ADDRESS } from "../utils/constant";
import { STORE_META_NAME, STORE_META_ADDRESS, USER_CONNECTED } from "./SImpleAddressConstants";

//initial reducer state
const initialState = {
  user: {
    address: NULL_ADDRESS,
    primaryMetaAddress: NULL_ADDRESS,
    primaryMetaName: ""
  },
};

const SimpleAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_CONNECTED: //update the user's address with the payload
      return {
        ...state,
        user: { ...state.user, address: action.payload },
      };
    case STORE_META_ADDRESS: //update the user's meta address with the payload
      return {
        ...state,
        user: { ...state.user, primaryMetaAddress: action.payload }
      }
    case STORE_META_NAME: //update the user's meta name with the payload
      return {
        ...state,
        user: { ...state.user, primaryMetaName: action.payload }
      }
    default:
      return state;
  }
};

export default SimpleAddressReducer;
