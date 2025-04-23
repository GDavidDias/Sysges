import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../redux/pageSlice";
import { useNavigate } from "react-router-dom";
import { outUser } from "../../redux/userSlice";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import logo from '../../assets/JUNTA-04.png';
import { setDelDocUser } from "../../redux/docUserSlice";
import { delDatosDocEdit, delListMovDoc } from "../../redux/documentoSlice";

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userSG = useSelector((state)=>state.user);
    const[habilitaButtonNewDoc, setHabilitaButtonNewDoc]=useState(false);
    const[habilitaButtonMetricas, setHabilitaButtonMetricas]=useState(false);
    const[time, setTime]=useState(new Date());

    const[open, setOpen]=useState(false);

    const logout = () => {
        dispatch(outUser());
        //dispatch(delEditLegajo());
        dispatch(setDelDocUser());
        dispatch(delDatosDocEdit());
        dispatch(delListMovDoc());
        navigate('/');
    };

    const submitNewDoc = () => {
        //ir a pantalla nuevo documento
        dispatch(setPage('NewDocumento'));
    };

    const submitDocumentosRec = () => {
        //ir a pantalla nuevo documento
        dispatch(setPage('PrincipalUser'));
    };

    const submitDashboard = () => {
        //ir a pantalla nuevo documento
        dispatch(setPage('Metricas'));
    };
    
    useEffect(()=>{
        //console.log('que tiene userSG en NavBar: ',userSG);
        //habilita o No botones, segun permiso del usuario
        //Permiso: 1 -> Administrador
        //Permiso: 2 -> usuario normal
        //Permiso: 3 -> Mesa Entrada
        //Permiso: 4 -> Consultas
        //Permiso: 5 -> Supervisor 
        if(userSG.permiso==3 || userSG.permiso ==1){
            setHabilitaButtonNewDoc(true);
        }else{
            setHabilitaButtonNewDoc(false);
        }
        if(userSG.permiso==1 || userSG.permiso==5){
            setHabilitaButtonMetricas(true);
        }else{
            setHabilitaButtonMetricas(false);
        }
    },[userSG])

    useEffect(()=>{
        console.log('que tiene open: ', open);
    },[open])

    useEffect(() => {
        setOpen(false);

        const interval = setInterval(() => {
          setTime(new Date());
        }, 1000);
    
        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
      }, []);

    return(
        <nav className="">
            {/* MENU MOVIL */}
            <div className="notranslate desktop:hidden bg-[#729DA6] h-[6vh] shadow-md">
                <div className="text-[30px] text-slate-50 flex flex-row justify-between">
                    <IoMdMenu 
                        className="text-slate-50 text-4xl font-bold "
                        onClick={()=>{setOpen(!open)}}
                        //onMouseEnter={()=>{setOpen(!open)}}
                    />
                    <div className="flex flex-row items-center justify-end mr-2">
                        <label className="pr-2 italic text-sm">{userSG.nombre}</label>
                        <FaRegUserCircle className="text-2xl text-slate-50 " />
                    </div>
                </div>
                <div 
                    className={`absolute bg-[#006489] opacity-90 text-[24px] left-0 text-center z-50 w-[100vw] h-[100vh] font-['Helvetica']
                            ${(open)
                                ?` visible`
                                :` invisible`
                            }
                        `}
                    // ref={menuRef}
                >
                    <ul >
                        <li className="my-4 text-slate-50 "
                            //onClick={()=>{handlePage('BoletinPage'); setOpen(false)}}
                            onClick={()=>{submitNewDoc(); setOpen(false)}}
                            translate='no'
                        >Nuevo Documento</li>
                        <li className="my-8 text-slate-50"
                            //onClick={()=>{handlePage('VerNotasMateriasPage'); setOpen(false)}}
                            onClick={()=>{submitDocumentosRec(); setOpen(false)}}
                        >Documentos Recibidos</li>
                        <li className="my-8 text-slate-50"
                            //onClick={()=>{handlePage('NotasMateriasPage'); setOpen(false)}}
                            onClick={()=>{submitDashboard(); setOpen(false)}}
                            translate='no'
                            >Metricas</li>
                        <li className="my-8 text-slate-50"
                            //onClick={()=>cierraSesion()}
                            onClick={()=>{logout(); setOpen(false)}}
                            translate='no'
                        >Salir</li>
                    </ul>
                </div>
            </div>

            {/* MENU ESCRITORIO */}
            <div className="notranslate movil:hidden  desktop:flex flex-row  border-b-[1px] border-[#729DA6]  justify-center bg-orange-50 h-[10vh] w-full shadow-md shadow-slate-500/40">
            {/* <div className="flex flex-row  border-b-[1px] border-[#729DA6]  justify-center bg-orange-50 h-[10vh] w-full"> */}
                <div className="desktop:w-[8vw] desktop:h-[10vh] movil:w-[80px] flex justify-center p-[4px] ">
                    <img className="" src={logo}/>
                </div>
                <div className="flex flex-col items-start justify-center w-[20vw] ml-0 ">
                    <label 
                        className="font-bold text-4xl text-sky-600  hover:text-[#6A88F7]"
                        translate='no'
                    >SYSGES</label>
                    <label className="text-xs" translate='no'>Sistema Gestion Documentos</label>
                </div>
                {/* <div>
                <label>{time.toLocaleTimeString()}</label>
                </div> */}
                <div className="flex flex-row ml-6 w-[40vw] justify-center items-center ">
                    <button
                        className={` notranslate text-base w-[40mm] h-[14mm] mx-2 rounded 
                            ${(habilitaButtonNewDoc)
                                ?`bg-[#729DA6] text-white hover:bg-[#6A88F7] shadow-md font-medium`
                                :`border-slate-300 bg-slate-200`
                            }
                        `}
                        disabled={!(habilitaButtonNewDoc)}
                        onClick={()=>submitNewDoc()}
                    >Nuevo Documento</button>
                    <button
                        className="notranslate text-base w-[40mm] h-[14mm] mx-2 bg-slate bg-[#729DA6] text-white hover:bg-[#6A88F7] rounded shadow-md font-medium"
                        onClick={()=>submitDocumentosRec()}
                    >Documentos Recibidos</button>
                    <button
                        className={`notranslate text-base w-[40mm] h-[14mm] mx-2 rounded 
                            ${(habilitaButtonMetricas)
                                ?`bg-[#729DA6] text-white hover:bg-[#6A88F7] shadow-md font-medium `
                                :`border-slate-300 bg-slate-200`
                            }
                        `}
                        onClick={()=>submitDashboard()}
                        disabled={!(habilitaButtonMetricas)}
                    >Metricas</button>
                </div>
                <div className="flex flex-row items-center justify-end  w-[25vw] ">
                    <label className="pr-2 italic text-sm">{userSG.nombre}</label>
                    <FaRegUserCircle className="text-2xl text-sky-600" />
                    <FaPowerOff 
                        className="text-2xl ml-4 text-sky-600 hover:cursor-pointer hover:text-[#6A88F7] transition-transform duration-500 transform hover:scale-125"
                        title="Salir"
                        onClick={()=>logout()}
                    />
                </div>
            </div>
        </nav>
    )
};

export default NavBar;