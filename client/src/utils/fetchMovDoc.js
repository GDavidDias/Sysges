import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchMovDoc = async(id) => {
    //console.log('que ingresa id en fetchMovDoc: ', id);
    try{
        const {data} = await axios.post(`${URL}/api/movimientos/${id}`);
        console.log('que trae data de fetchMovDoc: ', data);
        return data;
    }catch(error){
        console.log('error en fetchMovDoc: ', error.message);
    };
};