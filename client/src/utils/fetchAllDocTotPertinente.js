import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllDocTotPertinente = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/alldoctotpertinente`);
        //console.log('que trae data de fetchAllDocTotPertinente: ', data);
        return data;
    }catch(error){
        console.log('error en fetchAllDocTotPertinente: ', error.message);
    };
};