import { createStore } from 'redux'
import SimpleAddressReducer from './SimpleAddressReducers'

const store = createStore(SimpleAddressReducer)

export default store