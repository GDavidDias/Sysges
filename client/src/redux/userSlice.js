import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id_user:'',
    nombre:'',
    username:'',
    permiso:'',
    sector:'',
    sector_descripcion:''
};

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) => {
            //console.log('que ingresa a userSlice: ', action.payload);
            const{id, nombre, username,permiso,sector,sector_descripcion} = action.payload[0];
            state.id_user=id;
            state.nombre=nombre;
            state.username=username;
            state.permiso=permiso;
            state.sector=sector;
            state.sector_descripcion=sector_descripcion;

        },
        outUser:(state,action)=>{
            state.id_user='';
            state.nombre='';
            state.username='';
            state.permiso='';
            state.sector='';
            state.sector_descripcion='';
        }
    }
});

export const {setUser, outUser} = userSlice.actions;
export default userSlice.reducer;