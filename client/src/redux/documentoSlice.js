import { createSlice } from "@reduxjs/toolkit";

const initialState={
    datosDocEdit:{}, //datos del documento
    listMovDoc:[], //listado de movimientos del documento
    datosMovDoc:{} //datos del movimiento a editar.
}

export const documentoSlice = createSlice({
    name:'documento',
    initialState,
    reducers:{
        setDatosDocEdit:(state,action)=>{
            //
            state.datosDocEdit=action.payload;
        },
        delDatosDocEdit:(state,action)=>{
            state.datosDocEdit={};
        },
        setListMovDoc:(state,action)=>{
            //
            state.listMovDoc = action.payload;
        },
        delListMovDoc:(state,action)=>{
            state.listMovDoc=[];
        }
    }
});

export const {setDatosDocEdit,delDatosDocEdit,setListMovDoc,delListMovDoc} = documentoSlice.actions;
export default documentoSlice.reducer;