import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllDocTotDemora = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/alldoctotdemora`);
        //console.log('que trae data de fetchAllDocTotDemora: ', data);
        return data;
    }catch(error){
        console.log('error en fetchAllDocTotDemora: ', error.message);
    };
};