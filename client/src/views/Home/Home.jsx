import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Navbar/NavBar";
import { setPage } from "../../redux/pageSlice";
import PrincipalUser from "../../components/PrincipalUser/PrincipalUser";
import { fetchDocbyUser } from "../../utils/fetchDocbyUser";
import { setDelDocUser, setDocUser } from "../../redux/docUserSlice";
import NewDocumento from "../../components/NewDocumento/NewDocumento";
import EditarDocumento from "../../components/EditarDocumento/EditarDocumento";
import Footer from "../Footer/Footer";
import Dashboard from "../../components/Dashboard/Dashboard";

import {useIdleLogout} from '../../hooks/useIdleLogout';
import { useNavigate } from "react-router-dom";
import { outUser } from "../../redux/userSlice";
import { delDatosDocEdit, delListMovDoc } from "../../redux/documentoSlice";

const Home = () =>{
    const dispatch = useDispatch();
    const userSG = useSelector((state)=>state.user);
    const navigate = useNavigate();

    const pageSG = useSelector((state)=>state.page.page);
    const[content, setContent]=useState(null);

    const handleLogout=()=>{
        //Se cierra sesion
        dispatch(outUser());
        dispatch(setDelDocUser());
        dispatch(delDatosDocEdit());
        dispatch(delListMovDoc());
        navigate('/');
    };

    useIdleLogout(handleLogout,600000);

    const getDocRecibidos = async(id_user) => {
        const data = await fetchDocbyUser(id_user);
        //console.log('que trae data de fethDocbyUser: ', data);
        dispatch(setDocUser(data));
    };

    useEffect(()=>{
        console.log('en que pagina estoy: ', pageSG);
        switch(pageSG){
            case 'PrincipalUser':
                setContent(<PrincipalUser/>);
                break;
            case 'NewDocumento':
                setContent(<NewDocumento/>);
                break;
            case 'SearchDocumento':
                setContent();
                break;
            case 'EditDocumento':
                setContent(<EditarDocumento/>);
                break;
            case 'Metricas':
                setContent(<Dashboard/>);
                break;
        }
    },[pageSG]);

    useEffect(()=>{
        //console.log('que tiene userSG: ', userSG);
    },[userSG])

    useEffect(()=>{
        //INICIA CON PAGINA PRINCIPALUSER
        dispatch(setPage('PrincipalUser'))
        //Carga en Store Global los Documentos Recibidos
        getDocRecibidos(userSG.id_user);
    },[])

    return(
        <div className="h-full w-full fixed">
            <div className="">
                {/* BARRA DE NAVEGACION */}
                <NavBar/>
            </div>
            <div className=" desktop:h-[85vh] movil:h-[89vh] overflow-y-auto">
                {/* PAGINAS DE CONTENIDOS */}
                {content}
            </div>
            <div className="">
                {/* PIE DE SITIO */}
                <Footer/>
            </div>
        </div>
    )
};

export default Home;