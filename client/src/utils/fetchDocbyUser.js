import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchDocbyUser = async(id) => {
    //console.log('que ingresa id en fethDocbyUser: ', id);
    try{
        const {data} = await axios.post(`${URL}/api/documentosbyuser/${id}`);
        //console.log('que trae data de fetchAllBarrios: ', data);
        return data;
    }catch(error){
        console.log('error en fethDocbyUser: ', error.message);
    };
};