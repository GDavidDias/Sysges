import axios from 'axios';
import { URL } from '../../varGlobal';

export const changepass = async(form) => {
    //console.log('que viene de form a conexion: ', form);

    try{
        const {data} = await axios.put(`${URL}/api/changepass`,form);
        //console.log('que trae data de conexion: ', data);

        return data;
    }catch(error){
        console.log('error en conexion: ', error.message);
    };
};