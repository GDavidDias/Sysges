import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchDocTot = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/alldoctotalizados`);
        //console.log('que trae data de fetchDocTot: ', data);
        return data;
    }catch(error){
        console.log('error en fetchDocTot: ', error.message);
    };
};