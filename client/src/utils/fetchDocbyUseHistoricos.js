import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchDocbyUseHistoricos = async(id) => {
    console.log('que ingresa id en fethDocbyUser: ', id);
    try{
        const {data} = await axios.post(`${URL}/api/historicdocuser/${id}`);
        //console.log('que trae data de fetchDocbyUseHistoricos: ', data);
        return data;
    }catch(error){
        console.log('error en fetchDocbyUseHistoricos: ', error.message);
    };
};