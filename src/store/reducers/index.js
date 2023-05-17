import { combineReducers } from 'redux'
import userReducer from "./userReducer";
import tokenReducer from "./tokenReducer";

const rootReducer =combineReducers({

    user: userReducer,
    token: tokenReducer

})

export default rootReducer;
