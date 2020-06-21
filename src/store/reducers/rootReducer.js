import authReducer from './authReducer'
import submitTestReducer from './submitTestReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore';
import {firebaseReducer} from 'react-redux-firebase'

const rootReducer = combineReducers({
    auth: authReducer,
    submit: submitTestReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer