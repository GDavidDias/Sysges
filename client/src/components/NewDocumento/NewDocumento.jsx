import { useEffect, useState } from "react";
import { URL } from "../../../varGlobal";
import axios from "axios";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../redux/pageSlice";

const NewDocumento = () => {
    const dispatch = useDispatch();
    const userSG = useSelector((state)=>state.user);

    const[habilitaInputFecha, setHabilitaInputFecha]=useState(false);

    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");
    const[validaForm, setValidaForm]=useState(false);
    const[form, setForm]=useState({
        fecha_creacion:'',
        hora_creacion:'',
        nota:'',
        pertinente:'',
        asunto:'',
        tipodoc:'',
        origen:'',
        fojas:''
    });
    const[tipoDoc, setTipoDoc]=useState([
        {id:1, descripcion:'Recurso Jerarquico', abr:'RJ'},
        {id:2, descripcion:'Expediente', abr:'EXP'},
        {id:3, descripcion:'Solicitudes Varias', abr:'SOL'},
        {id:4, descripcion:'Amparo Judicial', abr:'AMP'},
        {id:5, descripcion:'Pedidos de Aclaratoria', abr:'PA'},
        {id:6, descripcion:'Solicitudes de Docentes', abr:'SD'},
    ]);

    const handleChange = (event)=>{
        const{name, value}=event.target;

        setForm({
            ...form,
            [name]:value
        });
    };

    const submitGuardar = async() => {
        await setFechaHoraActual();
        let idDocCreado='';
        const newForm={
            datetime_creacion:`${form.fecha_creacion} ${form.hora_creacion}`,
            nota:form.nota,
            pertinente:form.pertinente,
            asunto:form.asunto,
            tipodoc:form.tipodoc,
            origen:form.origen,
            fojas:form.fojas
        }
        //console.log('como queda newForm: ', newForm);
        //SE CREA DOCUMENTO
        await axios.post(`${URL}/api/newdocumento`,newForm)
            .then(async res=>{
                //console.log('que trae res.data crea nuevo documento: ', res.data);
                idDocCreado=res.data.id_documento;
                //console.log('que tiene id_documento creado: ', idDocCreado);                
            })
            .catch(error=>{
                console.log('que trae error crea nuevo documento: ', error)
                idDocCreado='';
            })
        //SE CREA MOVIMIENTO (SOLO SE CREA EN MESA ENTRADA DESTINO MESA ENTRADA, PARA QUE LO VEA EN SUS DOCUMENTOS RECIBIDOS Y PUEDA EDITAR Y ENVIAR A UNA AREA/SECTOR)
        if(idDocCreado!=''){
            const formMovimiento={
                id_documento:idDocCreado,
                user_origen:0,
                user_destino:userSG.id_user,
                id_area_destino:userSG.sector,
                datetime_recibido:`${form.fecha_creacion} ${form.hora_creacion}`,
                id_estado:1, //EnCurso
                observaciones:'Se recibe en Mesa de Entrada',
                datetime_movimiento:`${form.fecha_creacion} ${form.hora_creacion}`
            };
            //console.log('como queda formMovimiento: ', formMovimiento);
            await axios.post(`${URL}/api/newmovimiento`,formMovimiento)
                .then(async res=>{
                    //console.log('que trae res.data crea nuevo movimiento: ', res.data);
                    setMensajeModalInfo('Documento Creado, continue su envio a quien corresponda');
                    openModal();
                })
                .catch(error=>{
                    console.log('que trae error crea nuevo movimiento: ', error)
                })
        }
    };

    const setFechaHoraActual = ()=>{
        return new Promise((resolve)=>{
            const currentDateTime = new Date();
            const formatDate = currentDateTime.toISOString().slice(0,10);
            const formatTime = currentDateTime.toTimeString().slice(0,5);
            const updateForm={
                ...form,
                fecha_creacion:formatDate,
                hora_creacion:formatTime
            };
            setForm(updateForm);
            resolve(updateForm);
        });
    };

    const submitCloseModal=()=>{
        closeModal();
        dispatch(setPage('PrincipalUser'));
    }

    const seteaValoresIniciales=async()=>{
        await setFechaHoraActual();
    };


    useEffect(()=>{
        //console.log('que tiene form: ',form);
        if(form.nota!='' && form.pertinente!='' && form.asunto!='' && form.tipodoc!='' && form.asunto.length<=500 && form.origen!='' && form.fojas!=''){
            setValidaForm(true);
        }else{
            setValidaForm(false);
        }
    },[form])

    useEffect(()=>{
        //console.log('que tiene userSG en NewDocument: ',userSG);
        if(userSG.permiso==1){
            setHabilitaInputFecha(true);
        }else{
            setHabilitaInputFecha(false);
        }
    },[userSG])

    useEffect(()=>{
        //al renderizar componente
        seteaValoresIniciales();
    },[])

 return(
    <div className="notranslate flex flex-col items-center bg-gradient-to-br from-transparent via-slate-100 to-neutral-50">
    {/* <div className="flex flex-col items-center "> */}
        <div className=" text-2xl text-[#557CF2] font-bold text-center my-4">
            <h1>NUEVO DOCUMENTO</h1>
        </div>
        {/* DATOS DE NUEVO DOCUMENTO */}
        <div className="flex flex-row justify-center pb-2 desktop:w-[70vw] ">
            <div className="flex desktop:flex-col movil:flex-col desktop:w-[60vw] desktop:items-start movil:w-[80vw] movil:justify-start">
                <div className="flex desktop:flex-row movil:flex-col">
                    <div className="flex flex-col w-[40mm] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm ">Fecha:</label>
                        <input
                            name="fecha_creacion"
                            type="date"
                            className="border-[1px] border-slate-400 h-[7mm]"
                            value={form.fecha_creacion}
                            onChange={handleChange}
                            disabled={!(habilitaInputFecha)}
                        ></input>
                    </div>
                    <div className="flex flex-col w-[52mm] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm ">Pertinente:</label>
                        <select 
                            name="pertinente"
                            className="border-[1px] border-slate-400"
                            //value={form.pertinente}
                            onChange={handleChange}
                        > 
                            <option selected disabled>Seleccione...</option>
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
                </div>
                <div className="flex desktop:flex-row movil:flex-col">
                    <div className="flex flex-col desktop:w-[30vw] movil:w-[80vw] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm ">Nota:</label>
                        <input
                            name="nota"
                            type="text"
                            className="border-[1px] border-slate-400 desktop:w-[30vw] movil:w-[80vw]"
                            value={form.nota}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="flex flex-col w-[52mm] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm">Tipo Documento:</label>
                        <select 
                            name="tipodoc"
                            className="border-[1px] border-slate-400 w-[40mm]"
                            //value={form.pertinente}
                            onChange={handleChange}
                        > 
                            <option selected disabled>Seleccione...</option>
                            {
                                tipoDoc?.map((tipo)=>(
                                    <option key={tipo.id} value={tipo.id}>{tipo.abr} - {tipo.descripcion}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex desktop:flex-row movil:flex-col">
                    <div className="flex flex-col desktop:w-[30vw] movil:w-[80vw] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm ">Persona Física/Juridica:</label>
                        <input
                            name="origen"
                            type="text"
                            className="border-[1px] border-slate-400 desktop:w-[30vw] movil:w-[80vw]"
                            value={form.origen}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="flex flex-col desktop:w-[10vw] movil:w-[10vw] items-start desktop:m-2 movil:m-[2px]">
                        <label className="text-sm ">Fs:</label>
                        <input
                            name="fojas"
                            type="text"
                            className="border-[1px] border-slate-400 desktop:w-[10vw] movil:w-[80vw]"
                            value={form.fojas}
                            onChange={handleChange}
                        ></input>
                    </div>
                </div>

            </div>
        </div>
        <div className="flex flex-row justify-center ">
            <div className="desktop:w-[60vw] flex flex-col items-start movil:w-[80vw]">
                <label className="mt-3 text-sm">Asunto: </label>
                <textarea
                    name="asunto"
                    type="text"
                    className="border-[1px] border-slate-400 desktop:w-[59vw] h-[20vh] text-start px-[4px] movil:w-[80vw]"
                    value={form.asunto}
                    onChange={handleChange}
                ></textarea>
                <div>
                    <label
                        className={`text-sm  font-medium mr-2
                            ${(form.asunto.length<300)
                                ?`text-sky-600`
                                :`${(form.asunto.length>=300 && form.asunto.length<450)
                                    ?`text-orange-500`
                                    :`text-red-500`
                                }`
                            }
                            `}
                    >{`${form.asunto.length}/500`}</label>
                    {(form.asunto.length>500) &&
                        <label className="text-red-500 italic text-sm blink">No puede superar los 500 caracteres</label>
                    }
                </div>
            </div>
        </div>
        <div className="flex flex-row justify-center ">
            <div className="w-[50vw] flex flex-col items-center mt-4">
                <button 
                    // className="font-bold text-base w-[40mm] h-[12mm] mx-2  bg-slate bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                    className={`font-medium text-base w-[40mm] h-[12mm] mx-2 mt-2 rounded
                        ${(validaForm)
                            ?`bg-[#729DA6] text-white hover:bg-[#6A88F7] shadow-md`
                            :`border-slate-300 bg-slate-200`
                        }
                    `}
                    disabled={!(validaForm)}
                    onClick={submitGuardar}
                >Guardar</button>
            </div>
        </div>
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

export default NewDocumento;