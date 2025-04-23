import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchDocbySectorHistoricos = async(sector) => {
    console.log('que ingresa id en fethDocbySector: ', sector);
    try{
        const {data} = await axios.post(`${URL}/api/historicdocarea/${sector}`);
        //console.log('que trae data de fetchDocbySectorHistoricos: ', data);
        return data;
    }catch(error){
        console.log('error en fetchDocbySectorHistoricos: ', error.message);
    };
};