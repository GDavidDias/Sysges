import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllDocs = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/alldocumentos`);
        //console.log('que trae data de fetchAllDocs: ', data);
        return data;
    }catch(error){
        console.log('error en fetchAllDocs: ', error.message);
    };
};