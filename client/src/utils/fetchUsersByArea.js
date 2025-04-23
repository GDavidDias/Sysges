import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchUsersByArea = async(id) => {
    console.log('que ingresa id en fetchUsersByArea: ', id);
    try{
        const {data} = await axios.post(`${URL}/api/userbyarea/${id}`);
        console.log('que trae data de fetchUsersByArea: ', data);
        return data;
    }catch(error){
        console.log('error en fetchUsersByArea: ', error.message);
    };
};