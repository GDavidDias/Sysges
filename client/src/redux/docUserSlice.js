import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    listdocuser:[]
}

export const docrecSlice = createSlice({
    name:'docuser',
    initialState,
    reducers:{
        setDocUser:(state,action)=>{
            state.listdocuser = action.payload;
        },
        setDelDocUser:(state, action)=>{
            state.listdocuser=[];
        }
    }
});

export const {setDocUser, setDelDocUser} = docrecSlice.actions;
export default docrecSlice.reducer;