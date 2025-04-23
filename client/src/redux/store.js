import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import pageReducer from './pageSlice';
import docuserReducer from './docUserSlice';
import documentoReducer from './documentoSlice';

const store = configureStore({
    reducer:{
        user:userReducer,
        page:pageReducer,
        docuser:docuserReducer,
        documento:documentoReducer
    }
});
export default store;