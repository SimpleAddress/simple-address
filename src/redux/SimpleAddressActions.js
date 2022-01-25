import { USER_CONNECTED } from "./SImpleAddressConstants";

export function userConnected(payload) {
    return {
        type: USER_CONNECTED,
        payload
    }
}