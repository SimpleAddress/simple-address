import { STORE_META_ADDRESS, USER_CONNECTED } from "./SImpleAddressConstants";

// payload: current metamask address (meta address)
/**
 * An action to store a user's metamask address.
 * Updates the redux { user: address } state
 * @param {*} payload Current metamask address
 */
export function userConnected(payload) {
    return {
        type: USER_CONNECTED,
        payload
    }
}

/**
 * An action to store a user's meta address.
 * Updates the redux { primaryMetaAddress: metaAddress } state
 * @param {*} payload Current meta address
 */
export function storeMetaAddress(payload) {
    return {
        type: STORE_META_ADDRESS,
        payload
    }
}