import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersByArea } from "../../utils/fetchUsersByArea";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import { URL } from "../../../varGlobal";
import axios from "axios";
import { setPage } from "../../redux/pageSlice";
import './EditarDocumento.modules.css';

const EditarDocumento = () =>{
    // const selectSectorRef = useRef(null);
    // const selectUserRef=useRef(null);

    const dispatch = useDispatch();

    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");
    const datosMovDocSG = useSelector((state)=>state.documento.listMovDoc);
    const datosDocEditSG = useSelector((state)=>state.documento.datosDocEdit);
    const userSG = useSelector((state)=>state.user)
    const[sector, setSector]=useState('');
    const[userSector, setUserSector]=useState([]);
    const[validaEnviar, setValidaEnviar]=useState(false);
    const[validaRecibido, setValidaRecibido]=useState(false);
    const[botonAccion, setBotonAccion]=useState('');
    const[movDocOrder, setMovDocOrder]=useState([]);
    const[habilitaSelectSectorUser, setHabilitaSelectSectorUser]=useState(true);
    const[selectedEstado, setSelectedEstado]=useState('');


    const [form, setForm]=useState({
        id_documento:'', //id del documento actual
        user_origen:'', //id del usuario actual
        user_destino:'', //id del usuario a quien se envia
        id_area_destino:'', //id del area del user destino
        //datetime_recibido:'', //debe ir vacion para que lo complete quiern recepciona
        id_estado:'',
        observaciones:'',
        datetime_movimiento:'' //fecha y hora de envio
    });

    const[formRecibido, setFormRecibido]=useState({
        id_movimiento:'',
        datetime_recibido:''
    });

    const handleChange = (event)=>{
        const{name, value}=event.target;

        //SOLO SI SELECCIONO USUARIO DESTINO, TRAIGO SECTOR
        // if(name=='user_destino'){
        //     const sector = event.target.options[event.target.selectedIndex].dataset.sector;
        //     console.log('que ingresa por sector: ', sector);
        // }

        //Si es para id_estado y selecciono completado, seteo datos de usuario
        if(name=='id_estado'){
            setSelectedEstado(value);
            if(value==2){
                console.log('selecciono estado completado');
                setForm({
                    ...form,
                    [name]:value,
                    user_destino:userSG.id_user,
                    id_area_destino:userSG.sector
                });
                //completaSelectUsuario(userSG.sector, userSG.id_user);
                setHabilitaSelectSectorUser(true);

            }else{
                console.log('selecciono otro estado');
                setForm({
                    ...form,
                    [name]:value,
                    user_destino:'',
                    id_area_destino:''
                });
                //completaSelectUsuario(userSG.sector, userSG.id_user);
                setHabilitaSelectSectorUser(false);
            }
        }else if(name=='user_destino'){
            //SOLO SI SELECCIONO USUARIO DESTINO, TRAIGO SECTOR
            const sector = event.target.options[event.target.selectedIndex].dataset.sector;
            console.log('que ingresa por sector: ', sector);

            setForm({
                ...form,
                [name]:value,
                id_area_destino:sector
            });
            setHabilitaSelectSectorUser(false)
        }else{
            
            setForm({
                ...form,
                [name]:value
            });
            
            //SI INGRESO POR OBSERVACION Y ESTADO ES COMPLETADO NO DEBE HABILITARSE LOS SELECT DE SECTOR Y USER
            //SI EL ESTADO ES COMPLETADO NO HABILITO SELECT SECTOR Y USER
            if(selectedEstado==2){
                setHabilitaSelectSectorUser(true);
            }else{
                //SI ESTADO NO ES COMPLETADO, HABILITO LOS SELECT SECTOR Y USER
                setHabilitaSelectSectorUser(false);
            };
        };
    };


    const handleSelectSector = (event) =>{
        //const[name, value]=event.target;
        //console.log('que tiene event: ', event.target);
        const {name, value}=event.target;
        // console.log('que tiene name: ', name);
        // console.log('que tiene value: ', value);
        setSector(value);
    }

    function formatoFechaHora (datetime){
        const date = new Date(datetime);
        //Resto una hora
        date.setHours(date.getHours() -1);

        const formatoFecha = date.toISOString().slice(0,10);
        const formatoHora = date.toTimeString().slice(0,5);
        return{formatoFecha, formatoHora};
    };

    const {formatoFecha, formatoHora} = formatoFechaHora(datosDocEditSG.datetime_creacion);

    const setFechaHoraActual = ()=>{
        const currentDateTime = new Date();
        const formatDate = currentDateTime.toISOString().slice(0,10);
        const formatTime = currentDateTime.toTimeString().slice(0,5);
        setForm({
            ...form,
            datetime_movimiento:`${formatDate} ${formatTime}`,
            id_documento:datosDocEditSG.id,
            user_origen:userSG.id_user
        });
    };

    const setFechaHoraActualRecibido = (id_movimiento)=>{
        return new Promise((resolve)=>{
            const currentDateTime = new Date();
            const formatDate = currentDateTime.toISOString().slice(0,10);
            const formatTime = currentDateTime.toTimeString().slice(0,5);
            const updateForm={
                ...formRecibido,
                datetime_recibido:`${formatDate} ${formatTime}`,
                id_movimiento:id_movimiento
            };
            setFormRecibido(updateForm);
            resolve(updateForm);
        });
    };

    const submitRecibido = async() =>{
        //presiono boton Recibido y paso el id del movimiento
        const updateFormRecibido = await setFechaHoraActualRecibido(datosDocEditSG.ordenmov);
        //console.log('que tiene formRecibido en submitRecibido: ', updateFormRecibido);
        await axios.put(`${URL}/api/updfechamov`,updateFormRecibido)
            .then(async res=>{
                //console.log('que trae res.data actualiza fecha recibido: ', res.data);
                setBotonAccion('recibido')
                setMensajeModalInfo('Fecha de Recepcion Actualizada');
                openModal();
            })
            .catch(error=>{
                console.log('que trae error crea nuevo movimiento: ', error)
            });
    };

    const submitEnviar = async() => {
        console.log('presiono enviar');
        //console.log('como estas form: ',form);
        let id_mov_creado='';
        await axios.post(`${URL}/api/newmovimiento`,form)
            .then(async res=>{
                //console.log('que trae res.data crea nuevo movimiento: ', res.data);
                id_mov_creado=res.data.id_movimiento;
                setBotonAccion('enviar')
                setMensajeModalInfo('Movimiento realizado con exito');
                openModal();
            })
            .catch(error=>{
                console.log('que trae error crea nuevo movimiento: ', error)
            });
        //console.log('que tiene id_mov_creado: ',id_mov_creado);

        //Si el estado seleccionado fue completado, se ejecuta recibido para actualizar movimiento
        if(selectedEstado==2){
            //ejecuto actualizacion fecha hora de formRecibido y paso el id_movimiento creado anteriormente.
            const updateFormRecibido = await setFechaHoraActualRecibido(id_mov_creado);
            //console.log('que tiene formRecibido en submitRecibido: ', updateFormRecibido);
            await axios.put(`${URL}/api/updfechamov`,updateFormRecibido)
                .then(async res=>{
                    //console.log('que trae res.data actualiza fecha recibido: ', res.data);
                    setBotonAccion('enviar')
                    setMensajeModalInfo('Gestion de documento COMPLETADO');
                    openModal();
                })
                .catch(error=>{
                    console.log('que trae error crea nuevo movimiento: ', error)
                }); 
            }
    };

    const setValoresEstadoCompletado=()=>{
        //console.log('se agreg en fecha recibido en form');
        return new Promise((resolve)=>{
            const currentDateTime = new Date();
            const formatDate = currentDateTime.toISOString().slice(0,10);
            const formatTime = currentDateTime.toTimeString().slice(0,5);
            const updateForm={
                ...formRecibido,
                datetime_recibido:`${formatDate} ${formatTime}`,
                id_movimiento:datosDocEditSG.ordenmov
            };
            setFormRecibido(updateForm);
            resolve(updateForm);
        });
        
    };

    const submitCloseModal =()=>{
        //Debo discriminar si solo presiono Recibido, se queda en esta pantalla
        //Si presiono en Enviar regresa a pantalla PrincipalUser
        if(botonAccion=='enviar'){
            closeModal();
            dispatch(setPage('PrincipalUser'));
        };
        if(botonAccion=='recibido'){
            //debo actualizar los datos en datosDocEditSG para que traiga fecha recibido actualizado (depues)
            //Ahora sale a la pantalla principal, para que regrese con datos actualizados
            closeModal();
            dispatch(setPage('PrincipalUser'));
        }
    };

    const getUsersArea = async(id_sector)=>{
        
        const data = await fetchUsersByArea(id_sector);
        //console.log('que trae fetchuserbyarea: ', data);
        setUserSector(data);
    };

    const ordenaMovimientosFechaDesc = () =>{
        let movOrder = [...datosMovDocSG].sort((a,b)=>{
            return a.datetime_movimiento<b.datetime_movimiento ?1 :-1;
        });
        setMovDocOrder(movOrder);
    };


    useEffect(()=>{
        ////console.log('que tiene selectedEstado: ', selectedEstado);
    },[selectedEstado])

    useEffect(()=>{
        //al seleccionar o modificar Sector, traigo los usuarios de ese sector
        //console.log('que tiene sector: ', sector);
        if(sector){
            getUsersArea(sector);
        }
    },[sector])

    useEffect(()=>{
        //console.log('que tiene form: ', form);

        if(form.datetime_movimiento!='' && form.id_documento!='' && form.id_estado!='' && form.user_origen!='' && form.user_destino && validaRecibido && form.observaciones.length<=500){
            setValidaEnviar(true);
        }else{
            setValidaEnviar(false);
        }
    },[form])

    useEffect(()=>{
        //console.log('que tiene userSector: ',  userSector);
    },[userSector])

    useEffect(()=>{
        //console.log('que tiene datosMovDocSG: ',datosMovDocSG);
    },[datosMovDocSG])

    useEffect(()=>{
        console.log('que tiene datosDocEditSG: ', datosDocEditSG);
        if(datosDocEditSG){
            setForm({
                ...form,
                id_documento:datosDocEditSG.id,
            })
        };
        if(datosDocEditSG.datetime_recibido){
            setFormRecibido({
                ...formRecibido,
                datetime_recibido:datosDocEditSG.datetime_recibido
            })
        }
        if(datosDocEditSG.datetime_recibido=='' || datosDocEditSG.datetime_recibido == null){
            setValidaRecibido(false);
        }else{
            setValidaRecibido(true);
        }
    },[datosDocEditSG]);

    useEffect(()=>{
        //console.log('que tiene formRecibido: ',formRecibido);
        // if(formRecibido.datetime_recibido==''){
        //     setFechaHoraActualRecibido();
        // }
    },[formRecibido])

    useEffect(()=>{
        //console.log('que tiene userSG: ', userSG);
        if(userSG){
            setForm({
                ...form,
                user_origen:userSG.id_user
            })
        };

    },[userSG]);

    useEffect(()=>{
        //Al renderizar
        setFechaHoraActual();
        setBotonAccion('');
        //ordenaMovimientosFechaDesc();
    },[])

    return(
        <div className="notranslate flex flex-col items-center desktop:w-[98vw] bg-gradient-to-br from-transparent via-neutral-50 to-slate-200">
            <div className="text-2xl text-[#557CF2] font-bold text-center my-4">
                <h1>GESTIONAR DOCUMENTO</h1>
            </div>

            {/* SECCION DATOS Y RECIBIDO */}
            <div className="border-b-2 border-b-silver-200  flex desktop:w-[95vw] desktop:flex-row movil:flex-col-reverse movil:items-center movil:w-[100vw]">
                <div className=" desktop:w-[25vw] flex desktop:flex-col desktop:items-center movil:w-[80vw] movil:flex-row movil:justify-center">
                    <button
                        // className="font-bold text-base w-[30mm] h-[8mm] mx-2 mt-6 bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                        className={`font-medium text-base w-[30mm] h-[8mm] mx-2 mt-6 shadow-lg rounded
                            ${(validaRecibido)
                                ?`border-slate-300 bg-slate-200`
                                :`bg-[#729DA6] text-white hover:bg-[#6A88F7] hover:scale-110 hover:-translate-y-1 duration-300`
                            }
                        `}
                        disabled={(validaRecibido)}
                        onClick={()=>submitRecibido()}
                    >Recibido</button>
                    <div className="flex flex-col items-center my-2">
                        <label
                            className="text-sm"
                        >Fecha Recepcion:</label>
                        <label
                            className="border-[1px] border-slate-500 h-[8mm] w-[40mm] bg-slate-100"
                        >{(datosDocEditSG.datetime_recibido)
                            ?datosDocEditSG.datetime_recibido.split('T')[0]
                            :''
                            }</label>
                        <label className="italic text-sm text-red-500 font-medium blink">
                            {(validaRecibido)
                            ?``
                            :`Recuerde Recibir Documento`
                            }
                        </label>
                        
                    </div>
                </div>
                <div className="desktop:w-[75vw] movil:w-[95vw]">
                    <div className="border-[1px] bg-slate-200 p-2 desktop:w-[150mm] desktop:h-[50mm] mb-2 movil:w-[95vw]">
                        <label className="flex justify-start font-bold text-base">Datos del Documento</label>
                        <div className="flex desktop:flex-col movil:flex-col mt-2 mb-2 ">
                            <div className="flex desktop:flex-row movil:flex-col">
                                <div className="flex flex-row items-start desktop:mx-2 movil:mr-2">
                                    <label
                                        className="text-sm font-medium text-[#557CF2]"
                                    >Fecha:</label>
                                    <label
                                        className="desktop:h-[10mm] desktop:w-[26mm] movil:h-[5mm] movil:w-[70vw] text-sm italic flex items-center justify-center movil:justify-start movil:ml-2"
                                    // >{datosDocEditSG.datetime_creacion.split('T')[0]}</label>
                                    >{formatoFecha} ({formatoHora})</label>
                                </div>
                                <div className="flex flex-row items-start mr-2">
                                    <label
                                        className="text-sm font-medium text-[#557CF2]"
                                    >Nota:</label>
                                    <label
                                        className="desktop:h-[10mm] desktop:w-[90mm] pl-2 text-sm italic flex items-start movil:h-[5mm] movil:w-[80vw] "
                                    >{datosDocEditSG.nota}</label>
                                </div>
                            </div>
                            <div className="flex flex-row items-start desktop:ml-2 mt-2 movil:ml-0">
                                <label
                                    className="text-sm font-medium text-[#557CF2]"
                                >Pertinente:</label>
                                <label
                                    className="desktop:h-[5mm] desktop:w-[125mm] pl-2 text-sm italic flex items-start movil:h-[5mm] movil:w-[70vw] "
                                >{datosDocEditSG.pertinente}</label>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row items-start desktop:mx-2 movil:mx-0 ">
                                <label
                                    className="text-sm font-medium text-[#557CF2]"
                                >Asunto:</label>
                                <textarea
                                    className="ml-2 border-[1px] border-slate-100 h-[16mm] w-[125mm] text-sm pl-2 shadow-md"
                                >{`${(datosDocEditSG.origen)?datosDocEditSG.origen :''} ${(datosDocEditSG.fojas) ?`(fs:${datosDocEditSG.fojas})` :''} ${datosDocEditSG.asunto}`}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCION EDICION Y ENVIAR DOCUMENTO */}
            <div className="border-b-2 border-silver-500 shadow-sm flex desktop:w-[95vw] desktop:flex-row  mt-4 pb-4 movil:flex-col-reverse movil:w-[100vw] movil:items-center">
                <div className=" desktop:w-[25vw] flex flex-col items-center movil:w-[90vw] ">
                    <button
                        className={`font-medium text-base w-[30mm] h-[8mm] mx-2 mt-6 shadow-lg rounded
                            ${(validaEnviar)
                                ?`bg-[#729DA6] text-white hover:bg-[#6A88F7] hover:scale-110 hover:-translate-y-1 duration-300`
                                :`border-slate-300 bg-slate-200`
                            }
                        `}
                        disabled={(!validaEnviar)}
                        onClick={()=>submitEnviar()}
                    >Enviar</button>
                    <div className="desktop:w-[22vw] mt-2  italic text-sm movil:w[90vw]">
                        <label>Si selecciona Estado: COMPLETADO, usted finaliza la gestion del documento.</label>
                    </div>
                    {/* <div className="flex flex-col items-start my-2">
                        <label
                            className="text-sm"
                        >Fecha Envio:</label>
                        <label
                            className="border-[1px] border-slate-500 h-[8mm] w-[40mm] bg-slate-100"
                        >{(form.datetime_movimiento)
                            ?form.datetime_movimiento.split(' ')[0]
                            :''
                            }</label>
                    </div> */}
                </div>
                <div className="border-l-[1px] border-l-silver-500 desktop:w-[75vw] desktop:pl-2 movil:w-[95vw] movil:pl-0">
                    <label className="flex justify-start font-bold text-base">Enviar Documento a:</label>
                    <div className={`flex desktop:flex-row movil:flex-col
                    ${validaRecibido
                        ?``
                        :`pointer-events-none select-none`
                    }
                        `}>
                        <div className="flex flex-col items-start desktop:mx-2 movil:m-2">
                            <label
                                className="text-sm desktop:flex movil:hidden"
                            >Estado:</label>
                            <select
                                name="id_estado"
                                className="border-[1px] border-slate-500 h-[8mm] desktop:w-[40mm] movil:w-[50mm] shadow-md"
                                onChange={handleChange}
                            >
                                <option selected disabled>ESTADO...</option>
                                <option value={1}>En Curso</option>
                                <option value={2}>Completado</option>
                                <option value={3}>Demorado</option>
                            </select>
                        </div>
                        <div className="flex movil:flex-row">
                            <div className="flex flex-col items-start desktop:mx-2 movil:m-2">
                                <label
                                    className="text-sm desktop:flex movil:hidden"
                                >Sector:</label>
                                <select
                                    name="sector"
                                    className="border-[1px] border-slate-500 h-[8mm] w-[40mm] shadow-md"
                                    // value={sector}
                                    onChange={handleSelectSector}
                                    disabled={habilitaSelectSectorUser}
                                >
                                    <option selected disabled>SECTOR...</option>
                                    <option value={1}>Asesoria Legal</option>
                                    <option value={2}>Equipo Tecnico</option>
                                    <option value={3}>Presidencia</option>
                                    <option value={4}>Sala Inicial</option>
                                    <option value={5}>Sala Primaria</option>
                                    <option value={6}>Sala Secundaria</option>
                                    <option value={7}>Sala Superior</option>
                                    <option value={8}>Sala Tecnico Profesional</option>
                                    <option value={9}>Area Digital de Presidencia</option>
                                </select>
                            </div>
                            <div className="flex flex-col items-start desktop:mx-2 movil:m-2">
                                <label
                                    className="text-sm desktop:flex movil:hidden"
                                >Usuario:</label>
                                <select
                                    name="user_destino"
                                    className="border-[1px] border-slate-500 h-[8mm] w-[40mm] shadow-md"
                                    onChange={handleChange}
                                    disabled={habilitaSelectSectorUser}
                                >
                                    <option selected disabled>USUARIO...</option>
                                    {
                                        userSector?.map((user,index)=>(
                                            <option 
                                                value={user.id_usuario}
                                                data-sector={user.id_area}
                                                key={index}
                                            >{user.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        
                    </div>
                    <div>
                        <div className="flex flex-col items-start mx-2">
                            <label
                                className="text-sm "
                            >Observaciones:</label>
                            <textarea
                                name="observaciones"
                                className="border-[1px] border-slate-500 h-[18mm] desktop:w-[129mm] px-[2mm] movil:w-[90vw] shadow-md"
                                value={form.observaciones}
                                onChange={handleChange}
                            ></textarea>
                            <div>
                                <label
                                    className={`text-sm  font-medium mr-2
                                        ${(form.observaciones.length<300)
                                            ?`text-sky-600`
                                            :`${(form.observaciones.length>=300 && form.observaciones.length<450)
                                                ?`text-orange-500`
                                                :`text-red-500`
                                            }`
                                        }
                                        `}
                                >{`${form.observaciones.length}/500`}</label>
                                {(form.observaciones.length>500) &&
                                    <label className="text-red-500 italic text-sm blink">No puede superar los 500 caracteres</label>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCION MOVIMIENTOS HISTORICOS */}
            <div className="flex flex-col items-center mt-4">
                <label 
                    className="flex justify-start font-bold text-base"
                >Movimientos Historicos:</label>
                <div className="desktop:w-[80vw] desktop:h-[40vh] border-2 border-slate-400 rounded-lg overflow-y-auto my-2 movil:w-[95vw]">
                    <table className=" border-[1px] border-black bg-slate-50">
                        <thead>
                            <tr className="sticky top-0 text-[12px] bg-orange-200 text-black font-bold">
                                <th className="w-[25mm] h-[10mm] border-[1px] border-slate-50" >FECHA</th>
                                <th className="w-[40mm] h-[10mm] border-[1px] border-slate-50" >ORIGEN</th>
                                <th className="w-[40mm] h-[10mm] border-[1px] border-slate-50" >DESTINO</th>
                                <th className="w-[80mm] h-[10mm] border-[1px] border-slate-50" >OBSERVACION</th>
                                <th className="w-[30mm] h-[10mm] border-[1px] border-slate-50" >ESTADO</th>
                                <th className="w-[50mm] h-[10mm] border-[1px] border-slate-50" >RECIBIDO</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* datosMovDocSG / movDocOrder*/}
                            {
                                datosMovDocSG?.map((mov,index)=>{
                                    const movimientodatetime = formatoFechaHora(mov.datetime_movimiento);
                                    const recibidodatetime=formatoFechaHora(mov.datetime_recibido);
                                    const{formatoFecha: movimientofecha, formatoHora: movimientohora} = movimientodatetime;
                                    const{formatoFecha: recibidofecha, formatoHora: recibidohora} = recibidodatetime;
                                    return(
                                        <tr className="text-sm" key={index}>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300">{movimientofecha} ({movimientohora})</td>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300" >{mov.usuario_origen}</td>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300" >{mov.usuario_destino}</td>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300" >{mov.observaciones}</td>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300" >{mov.estado}</td>
                                            <td className="h-[10mm] border-[1px] border-b-slate-300" >
                                                {
                                                    (mov.datetime_recibido)
                                                    ?`${recibidofecha} (${recibidohora}) ${mov.usuario_destino}`
                                                    :''
                                                }
                                                
                                            </td>
                                        </tr>
                                    )
                                }
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* VENTANA MODAL */}
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModal()}
                        >OK</button>
                    </div>
                </div>
            </Modal>

        </div>
    )
};

export default EditarDocumento;