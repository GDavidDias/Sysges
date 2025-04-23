import axios from 'axios';
import { URL } from '../../varGlobal.js';

export const conexion = async(form) => {
    //console.log('que viene de form a conexion: ', form);

    try{
        const {data} = await axios.post(`${URL}/api/validate`,form);
        //console.log('que trae data de conexion: ', data);

        return data;
    }catch(error){
        console.log('error en conexion: ', error.message);
    };
};