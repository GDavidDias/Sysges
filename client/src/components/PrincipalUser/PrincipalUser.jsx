import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocUser } from "../../redux/docUserSlice";
import { fetchDocbyUser } from "../../utils/fetchDocbyUser";
import { FaEdit } from "react-icons/fa";
import { FaHourglassStart, FaHourglassHalf, FaHourglassEnd, FaHourglass } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { FaDotCircle, FaSearch, FaEye, FaTimes} from "react-icons/fa";
import { setPage } from "../../redux/pageSlice";
import { setDatosDocEdit, setListMovDoc } from "../../redux/documentoSlice";
import { fetchMovDoc } from "../../utils/fetchMovDoc";
import { fetchDocbyUseHistoricos } from "../../utils/fetchDocbyUseHistoricos";
import { useModal } from "../../hooks/useModal";
import ModalDatosHistoricos from "../ModalDatosHistoricos/ModalDatosHistoricos";
import ModalEdit from '../ModalEdit/ModalEdit';
import {fetchAllDocs} from "../../utils/fetchAllDocs";
import { fetchDocbySectorHistoricos } from "../../utils/fetchDocbySectorHistoricos";
import { GrEdit } from "react-icons/gr";
import { FaFileExport } from "react-icons/fa";
import { Title } from "chart.js";
import { URL } from "../../../varGlobal";
import Modal from "../Modal/Modal";
import axios from "axios";


const PrincipalUser = () =>{
    const[isOpenModalNotif,openModalNotif,closeModalNotif]=useModal(false);
    const[isOpenModalEdit,openModalEdit,closeModalEdit]=useModal(false);
    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");
    const dispatch = useDispatch();
    const userSG = useSelector((state)=>state.user)
    const docrecSG = useSelector((state)=>state.docuser.listdocuser);
    const datosMovDocSG = useSelector((state)=>state.documento.listMovDoc);

    const[inputSearch, setInputSearch]=useState('');
    const[isDivOpcionesVisible, setIsDivOpcionesVisible]=useState(false);
    const[isIntervalActive, setIsIntervalActive]=useState(true);
    const[isChecked, setIsChecked] = useState(false);
    const[selectedRadioTipoDocRec, setSelectedRadioTipoDocRec]=useState('actuales');

    //Boton State True es Mios / False es Sector
    const[toggleButtonTipoHistorico, setToggleButtonTipoHistorico]=useState(true);

    const[docRecFilter, setDocRecFilter]=useState([]);

    const[selectedValue, setSelectedValue]=useState('');
    const[selectValueFiltroOpcion, setSelectValueFiltroOpcion]=useState('');

    const[tipoFiltro, setTipoFiltro]=useState('');
    const[datosFiltro, setDatosFiltro]=useState([]);
    const datosEstado = [
        {id:1, descripcion:'En Curso'},
        {id:2, descripcion:'Completado'},
        {id:3, descripcion:'Demorado'},
    ];

    const datosSector = [
        {id:1, descripcion:'Asesoria Legal'},
        {id:2, descripcion:'Equipo Tecnico'},
        {id:3, descripcion:'Presidencia'},
        {id:4, descripcion:'Sala Inicial'},
        {id:5, descripcion:'Sala Primaria'},
        {id:6, descripcion:'Sala Secundaria'},
        {id:7, descripcion:'Sala Superior'},
        {id:8, descripcion:'Sala Tecnico Profesional'},
        {id:9, descripcion:'Area Digital de Presidencia'},
    ];

    const tipoDocumento = [
        {id:1, descripcion:'Recurso Jerarquico', abr:'RJ'},
        {id:2, descripcion:'Expediente', abr:'EXP'},
        {id:3, descripcion:'Solicitudes Varias', abr:'SOL'},
        {id:4, descripcion:'Amparo Judicial', abr:'AMP'},
        {id:5, descripcion:'Pedidos de Aclaratoria', abr:'PA'},
        {id:6, descripcion:'Solicitudes de Docentes', abr:'SD'},
    ];

    const[formDocumento, setFormDocumento]=useState({
        id:'',
        nota:'',
        idPertinente:'',
        asunto:'',
        origen:'',
        fojas:''
    });

    const[validaForm, setValidaForm]=useState(false);

    const handleChangeRadio=(event)=>{
        console.log('selecciono un radio button')
        console.log('que trae event.target.value: ',event.target.value);
        console.log('actualizo setSelectedRadioTipoDocRec');
        setSelectedRadioTipoDocRec(event.target.value);
        console.log('como queda SelectedRadioTipoDocRec: ',selectedRadioTipoDocRec);
        //Como selecciono otro tipo de listado, actualizo documentos recibidos
        //getDocRecibidos(userSG.id_user,event.target.value, userSG.sector)
        
        seteoFiltrosBusquedaInicio();
        
        //Configuro intervalo para actualizar datos periodicamente
        if(event.target.value=='actuales'){
            console.log('selecciono radio ACTUALES');
            getDocRecibidos(userSG.id_user,event.target.value, userSG.sector)
            //console.log('CONFIGURO INTERVALO: ')
            setIsIntervalActive(true);
            setIsDivOpcionesVisible(false);
        
        }else{
            console.log('selecciono radio HISTORICOS/TODOS');
            getDocRecibidos(userSG.id_user,event.target.value,userSG.sector);
            //console.log('ELIMINO INTERVALO: ')
            setIsIntervalActive(false);
            setIsDivOpcionesVisible(true);
        }
    };

    function seteoFiltrosBusquedaInicio(){
        setInputSearch('');
        setDatosFiltro([]);
        //handleSelectFiltro(null);
        setSelectedValue('');
    };

    const getDocRecibidos = async(id_user,tipo_doc_rec,sector) => {
        // console.log('ingresa a getDocRecbidos con: ')
        // console.log('id_user: ', id_user);
        // console.log('tipo_doc_rec: ', tipo_doc_rec);
        // console.log('sector: ', sector);
        let data;
        if(tipo_doc_rec=='actuales'){
            console.log('ingrsa por tipo_doc_rec actuales');
            data = await fetchDocbyUser(id_user);
            console.log('que trae data de fethDocbyUser: ', data);
        }
        
        if(tipo_doc_rec=='historicos'){
            console.log('ingrsa por tipo_doc_rec historicos');
            console.log('que tiene toggleButtonTipoHistorico: ',toggleButtonTipoHistorico);
            if(toggleButtonTipoHistorico){
                //Si son historicos del usuario
                data = await fetchDocbyUseHistoricos(id_user);
                //console.log('que trae data de fetchDocbyUseHistoricos: ', data);
            }else{
                //Si son Historicos del Sector
                data = await fetchDocbySectorHistoricos(sector)
                //console.log('que trae data de fetchDocbySectorHistoricos: ', data);
            }
            
        }

        if(tipo_doc_rec=='detodos'){
            console.log('ingrsa por tipo_doc_rec detodos');
            data = await fetchAllDocs();
            //console.log('que trae data de fetchAllDocs: ', data);
        }

        dispatch(setDocUser(data));
    };

    function formateaFechaHora (datetime){
        const date = new Date(datetime);

        //Resto una hora
        date.setHours(date.getHours() -1);

        //const date = new Date(datetime).toLocaleString();
        //console.log('que tiene date despues de toLocaleString(): ', date);
        const formatFecha = date.toISOString().slice(0,10);
        //console.log(' que tiene formatFecha: ', formatFecha)
        const formatHora = date.toTimeString().slice(0,5);
        //console.log(' que tiene Hora: ', formatHora)
        
        // const formatFecha = date.toString().split(',')[0];
        // console.log('que tiene slice(0,10)', formatFecha);
        // const formatHora = date.toString().split(',')[1].slice(0,6).replace(/\s+/g, '');
        // console.log('que tiene split(,)', formatHora);
        
        return{formatFecha,formatHora};
    };

    function calculateDaysElapsed(datestring){
        const givenDate = new Date(datestring);
        const currentDate = new Date();
        const timeDifference = currentDate - givenDate;
        const diasTrasncurridos = Math.floor(timeDifference/(1000*60*60*24));
        return diasTrasncurridos;
    };

    function parseDateWithoutTimezone(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)); // Crear fecha en UTC
      }

    function calculateDiasHabilesTranscurridos(datestring_ini, datestring_fin,id_estado){
        // console.log('EJECUTO FUNCION calculateDiasHabilesTranscurridos')
        // console.log('que ingresa por datestring_ini: ', datestring_ini);
        // console.log('que ingresa por datestring_fin: ', datestring_fin);
        // console.log('que ingresa por id_estado: ', id_estado);

        let startDate = parseDateWithoutTimezone(datestring_ini);
        //let startDate = (datestring_ini);
        //console.log('como convierte dateString a starDate: ', startDate)
        
        let currentDate
        if(id_estado==2){
            currentDate = parseDateWithoutTimezone(datestring_fin);
            //currentDate =(datestring_fin);
        }else{

            currentDate = new Date();
        }
        //console.log('que tiene currentDate: ', currentDate);

        //Cambia fecha si startDate es despues de currentDate
        if(startDate>currentDate){
            //console.log('ingresa a intercambia fecha');
            [startDate,currentDate] = [currentDate, startDate];
        };

        let count =0;
        let currentDateIter = new Date(startDate);

        //console.log('para starDate :', startDate);
        while(currentDateIter<=currentDate){
            const dayOfWeek = currentDateIter.getUTCDay();
            //Salta Sabado(6) y Domingo(0)
            //console.log('que dia de la semana es: ', dayOfWeek);
            if(dayOfWeek !== 0 && dayOfWeek !== 6){
                count++;
            };
            currentDateIter.setUTCDate(currentDateIter.getUTCDate()+1);
        }

        return count;
    };

    function getIcon(diasTranscurridos,estado){
        //SI ESTADO ES COMPLETADO MUESTRO ICONO EN GRIS
        if(estado==2){
            return <FaHourglass className="text-gray-500 text-lg "/>
        }else{
            if(diasTranscurridos<=2){
                return <FaHourglassStart className="text-green-500 text-lg "/>
            }else if (diasTranscurridos>=5){
                return <FaHourglassEnd className="text-red-500 text-lg"/>
            }else {
                return  <FaHourglassHalf className="text-yellow-400 text-lg"/>
            }
        }
    };

    //AL SELECCIONAR EL TIPO DE FILTRO, SE CARGAN LOS FILTROS ESPECIFICOS, SI SELECCIONO TODOS SE MUESTRAN TODOS LOS DOCUMENTOS
    const handleSelectFiltro = (event) =>{
        console.log('seleccionar un filtro y se completan los filtros especificos')
        resetSelectFiltroSeleccionado();
        const{value} = event.target;
        //console.log('que selecciona filtro: ', value);
        setTipoFiltro(value);
        setSelectedValue(value);
        if(value=='todos'){
            setDatosFiltro([]);
            //setDocRecFilter(docrecSG);
        }else if(value=='estado'){
            setDatosFiltro(datosEstado);
        }else if(value=='pertinente'){
            setDatosFiltro(datosSector);
        }else if(value=='tiponota'){
            setDatosFiltro(tipoDocumento);
        }
        setIsChecked(false);
    };

    //RESETEO EL SELECT ESPECIFICO PARA QUE NO MUESTRA DATOS, Y TRAIGO DE NUEVO LOS DOCUMENTOS
    const resetSelectFiltroSeleccionado = () =>{
        setSelectValueFiltroOpcion('');
        setDocRecFilter(docrecSG);
    };

    //AL SELECCIONAR EN ESPECIFICO ALGUN TIPO DE FILTRO, SE FILTRAN LOS DOCUMENTOS QUE SE GUARDARON EN EL STORE GLOBAL
    const handleSelectFiltroOpcion = (event)=>{
        const{value}=event.target;
        //asigno valor del select seleccionado
        setSelectValueFiltroOpcion(value);

        console.log('que tiene Tipo Filtro: ', tipoFiltro);
        console.log('que selecciona filtroOpcion: ', value);
        if(tipoFiltro==='pertinente'){
            const docFilter = docrecSG.filter(doc=>doc.idPertinente==value);
            setDocRecFilter(docFilter);
        }
        if(tipoFiltro==='estado'){
            // console.log('que tiene tipoFiltro: ', tipoFiltro);
            // console.log('que ingrea por value: ', value);
            // console.log('queu tiene docrecSG: ', docrecSG);
            const docFilter = docrecSG.filter(doc=>doc.id_estado==value);
            //console.log('como queda docFilter: ', docFilter);
            setDocRecFilter(docFilter);
        }
        if(tipoFiltro==='tiponota'){
            const docFilter = docrecSG.filter(doc=>doc.tipodoc==value);
            setDocRecFilter(docFilter);
        }
    };
    
    //AL SELECCIONAR ALGUN TIPO DE ORDENAMIENTO, SE ORDENAN LOS DOCUMENTOS CON SORT
    const handleSelectOrdenar=(event)=>{
        const{value}=event.target;
        //console.log('que selecciona Ordenar: ', value);
        if(value=='fechaasc'){
            let sortDoc;
            sortDoc = [...docRecFilter].sort((a,b)=>{
                return a.datetime_creacion>b.datetime_creacion ?1 :-1;
            });
            setDocRecFilter(sortDoc);
        }
        if(value=='fechadesc'){
            let sortDoc;
            sortDoc = [...docRecFilter].sort((a,b)=>{
                return a.datetime_creacion<b.datetime_creacion ?1 :-1;
            });
            setDocRecFilter(sortDoc);
        }
    };

    //PRESIONO LA TECLA ENTER DENTRO DEL CUADRO BUSQUEDA
    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
    };

    //SE BUSCAN LOS DOCUMENTOS QUE SE GUARDARON EN EL STORE GLOBAL USANDO FILTRO SEGUN EL INPUT SEARCH
    const submitSearchDoc = async()=>{
        //console.log('presiono buscar con este input: ', inputSearch);
        let searchDoc;
        searchDoc = await docrecSG.filter(doc=>doc.nota.toLowerCase().includes(inputSearch.toLowerCase()) || doc.asunto.toLowerCase().includes(inputSearch.toLowerCase()));
        setDocRecFilter(searchDoc);
    };

    //PRESIONO EN BOTON CANCELAR DENTRO DE CUADRO BUSQUEDA
    const handleCancelSearch=async()=>{
            seteoFiltrosBusquedaInicio();
            setInputSearch('')
            setDocRecFilter(docrecSG);
    };

    const getMovimientosDocumento = async(id_doc)=>{
        const data = await fetchMovDoc(id_doc);
        //console.log('que trae fechMovDoc: ', data);
        dispatch(setListMovDoc(data));
    };

    //PRESIONO EDITAR/VER DOCUMENTO 
    const submitHandlerEdit = async(datosDoc) =>{
        //Enviar a StoreGlobal, datos del movimiento y Documento a editar
        //console.log('que recibe datosDoc: ', datosDoc);
        dispatch(setDatosDocEdit(datosDoc));

        //Enviar a StoreGlobal, datos de los movimientos del documento
        getMovimientosDocumento(datosDoc.id);

        if(selectedRadioTipoDocRec=='actuales'){
            //SI EL ESTADO DEL DOCUMENTO NO ES COMPLETADO, PUEDO GESTIONAR DOCUMENTO
            if(datosDoc.id_estado!=2){
                //Voy a pantalla Edicion de Documento
                //console.log('Voy a pantalla Gestion Documento')
                dispatch(setPage('EditDocumento'));
            }else{
                //Muestro ventana modal con Historicos del Documento
                //console.log('Muestro modal con datos historicos');
                setMensajeModalInfo('Datos Historicos');
                openModal();    
            }
        }else{
            //Muestro ventana modal con Historicos del Documento
            //console.log('Muestro modal con datos historicos');
            setMensajeModalInfo('Datos Historicos');
            openModal();

        }
    };

    function formatoFechaHora (datetime){
        const date = new Date(datetime);

        //Resto una hora
        date.setHours(date.getHours() -1);

        const formatoFecha = date.toISOString().slice(0,10);
        const formatoHora = date.toTimeString().slice(0,5);
        return{formatoFecha, formatoHora};
    };

    //FORMATEA FECHA SOLO PARA VISUALIZACION COMO ARGENTINA
    function formatArgFecha(fecha){
        console.log('que fecha ingresa a FORMATARGFECHA: ', fecha);

        // Dividir la cadena de fecha en componentes
        const [year, month, day] = fecha.split('-');

        // Crear un nuevo objeto de fecha con los componentes
        const date = new Date(year, month - 1, day); // El mes es base 0

        //const date = new Date(fecha);
        console.log('como convierte fecha new Date: ', date);

        // const dia = String(date.getDate()).padStart(2, '0');
        // console.log('como convierte dia: ',dia);
        // const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
        // console.log('como convierte mes: ',mes);
        // const ano = date.getFullYear();
        // console.log('como convierte ano: ',ano);
        // let fechaFormateada = `${dia}/${mes}/${ano}`;
        
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaFormateada = date.toLocaleDateString('es-ES', opciones);

        console.log('como queda armada la fecha fechaFormateada: ', fechaFormateada);

        return (fechaFormateada);
    };

    

    //Check usado para ocultar completados
    // const handleCheck = (event) =>{
    //     setIsChecked(event.target.checked);
    //     //console.log('que trae event.target.checked: ', event.target.checked);
    // };

    const handleKeyPress = (event) =>{
        if(event.key==='Enter'){
            //document.getElementById("botonSearch")?.click();
            submitSearchDoc();
            //submitHandler();
        }
    };

    //Para editar documento
    const submitEditDoc = async(datos) =>{
        await seteaDatosFormDocumento(datos);
        openModalEdit();

    };

    const seteaDatosFormDocumento=(datosDoc)=>{
        console.log('que tiene datosDoc en seteaDatosFormDocumento: ', datosDoc);
        const formInicial = {
            id:datosDoc.id,
            nota:datosDoc.nota,
            idPertinente:datosDoc.idPertinente,
            asunto:datosDoc.asunto,
            origen:datosDoc.origen,
            fojas:datosDoc.fojas
        };
        setFormDocumento(formInicial);
    };

    const submitGuardar = async() =>{
        await axios.put(`${URL}/api/updatedocumento`,formDocumento)
            .then(async res=>{
                console.log('que trae res.data updatedocumento: ', res);
                setMensajeModalInfo('Documento Actualizado Correctamente');
                openModalNotif();
            })
            .catch(error=>{
                console.log('que trae error updatedocumento: ', error);
            })
    };

    const submitCloseEdit = () =>{
        setFormDocumento({
            id:'',
            nota:'',
            idPertinente:'',
            asunto:'',
            origen:'',
            fojas:''
        });

        closeModalEdit();
    };

    const handleChangeEdit=(event)=>{
        const{name, value} = event.target;
        setFormDocumento({
            ...formDocumento,
            [name]:value
        });
    }

    const submitCloseModalNotif = () =>{
        closeModalNotif();
        setMensajeModalInfo('')
        closeModalEdit();
        getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec, userSG.sector);
    };



    useEffect(()=>{
        console.log('que tiene formDocumento: ',formDocumento);

        if(formDocumento.asunto==='' || formDocumento.idPertinente==='' || formDocumento.nota==='' || formDocumento.fojas==='' || formDocumento.origen===''){
            setValidaForm(false);
        }else{
            setValidaForm(true);
        }
    },[formDocumento])

    useEffect(()=>{
        //console.log('INGRESO useEffect toggleButtonTipoHistorico')
        getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec,userSG.sector);
        seteoFiltrosBusquedaInicio();
    },[toggleButtonTipoHistorico])

    useEffect(()=>{
        //console.log('que tiene inputSearch: ', inputSearch);
    },[inputSearch])

    useEffect(()=>{
        //console.log('que tiene isChecked: ', isChecked);
        if(isChecked){
            const docRecComplete = docrecSG.filter(doc=>doc.id_estado!=2);
            setDocRecFilter(docRecComplete);
        }else{
            //
            setDocRecFilter(docrecSG);
        }
    },[isChecked])

    useEffect(()=>{
        //console.log('que tiene docRecFilter: ', docRecFilter);
        console.log('docRecFilter fue actualizado');

    },[docRecFilter])

    useEffect(()=>{
        console.log('que tiene docrecSG: ', docrecSG);

        //copio los documentos al store local
        setDocRecFilter(docrecSG);
    },[docrecSG]);

    useEffect(()=>{
        console.log('que tiene userSG: ', userSG);
    },[userSG])


    useEffect(()=>{
        if (!isIntervalActive) return;

        //console.log('INGRESO useEffect userSG - selectedRadioTipoDocRec')
        getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec, userSG.sector);
        
        const intervalId = setInterval(()=>{
            getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec, userSG.sector);
        }, 10000);

        return()=>clearInterval(intervalId);
    },[userSG.id_user,selectedRadioTipoDocRec]);


    useEffect(()=>{
        //AL RENDERIZAR PANTALLA TRAIGO LOS DOCUMENTOS ACTUALIZADOS
        getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec, userSG.sector);
        
    },[])

    return(
        <div className="notranslate flex flex-col items-center bg-gradient-to-br from-transparent via-slate-200 to-neutral-50">
            <div className="text-2xl text-[#557CF2] font-bold text-center my-4">
                <h1 translate='no'>DOCUMENTOS RECIBIDOS</h1>
            </div>
            {/* BARRA SELECCION TIPO LISTADO */}
            <div className="flex desktop:flex-row desktop:justify-between movil:flex-col movil:items-center w-[90vw]">
                <div className=" desktop:w-[25vw]">{
                    (selectedRadioTipoDocRec==='actuales' && docrecSG.length!=0) &&
                        <label
                            className="font-medium text-[#557CF2] tracking-tight flex animate-bounce"
                        >{`(${docrecSG.length}) Documentos Actuales`}</label>
                    }
                </div>
                <div className=" desktop:w-[40vw]">
                    <div className="flex flex-row justify-center">
                        <label className="mx-2" translate='no'>
                            <input
                                type="radio"
                                value={'actuales'}
                                className="mr-[3px]"
                                checked={selectedRadioTipoDocRec==='actuales'}
                                onChange={handleChangeRadio}
                            />
                            Actuales
                        </label>
                        <label className="mx-2" translate='no'>
                            <input
                                type="radio"
                                value={'historicos'}
                                className="mr-[3px]"
                                checked={selectedRadioTipoDocRec==='historicos'}
                                onChange={handleChangeRadio}
                            />
                            Historicos
                        </label>
                        <label className="mx-2" translate='no'>
                            <input
                                type="radio"
                                value={'detodos'}
                                className="mr-[3px]"
                                checked={selectedRadioTipoDocRec==='detodos'}
                                onChange={handleChangeRadio}
                                disabled={(userSG.permiso==5 || userSG.permiso==1) ?false :true}
                            />
                            Todos
                        </label>
                        
                    </div>
                </div>
                <div className=" desktop:w-[25vw]">

                </div>
            </div>

            {/* BARRA DE FILTROS Y ORDENAMIENTOS */}
            <div className={`flex desktop:flex-row movil:flex-col desktop:justify-center movil:items-center transition-all duration-500 mt-2 
                ${isDivOpcionesVisible 
                    ? `max-h-screen opacity-100` 
                    : `max-h-0 opacity-0 overflow-hidden`
                }`}>
                {/* <div className="flex items-center mr-4 border-[1px] border-black p-[3px] bg-sky-200 cursor-pointer hover:bg-green-300"
                onClick={()=>getDocRecibidos(userSG.id_user,selectedRadioTipoDocRec)}
                >
                    <GrUpdate className="text-lg text-black"/>
                </div> */}
                <div className="mr-4">
                    <label translate='no'>Filtrar:</label>
                    <select
                        name="filtro"
                        className="border-[1px] border-slate-400 mx-2 rounded"
                        onChange={handleSelectFiltro}
                        value={selectedValue}
                        translate='no'
                    >
                        <option selected disabled>Seleccione...</option>
                        <option value={'todos'}>TODOS</option>
                        <option value={'pertinente'}>Pertinente</option>
                        <option value={'estado'}>Estado</option>
                        <option value={'tiponota'}>Tipo Documento</option>
                    </select>

                    {/* Si es TODOS, se deshabilita el select auxiliar */}
                    <select
                        name="filtroSeleccionado"
                        className="w-[40mm] border-[1px] border-slate-400 mx-2 rounded"
                        onChange={handleSelectFiltroOpcion}
                        value={selectValueFiltroOpcion}
                        translate='no'
                    >
                        <option value='' selected disabled>Seleccione...</option>
                        {
                            datosFiltro?.map((filtro, index)=>(
                                <option key={index} value={filtro.id}>{filtro.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="ml-4 movil:mt-2 desktop:mt-0">
                    <label translate='no'>Ordenar: </label>
                    <select
                        name="ordenar"
                        className="w-[30mm] border-[1px] border-slate-400 mx-2 rounded"
                        onChange={handleSelectOrdenar}
                        translate='no'
                    >
                        <option selected disabled>Seleccione...</option>
                        <option value={'fechaasc'}>Fecha Asc</option>
                        <option value={'fechadesc'}>Fecha Desc</option>
                    </select>
                </div>
                {/* <div className="ml-4 flex items-center">
                    <label className="mr-2">Ocultar Completados</label>
                    <label>
                        <input type="checkbox" checked={isChecked} className="w-4 h-4" onChange={handleCheck}/>
                    </label>
                    
                </div> */}
                <div className="flex movil:mt-2 desktop:mt-0">
                    <div className="ml-4 flex flex-row">
                        <div className="mx-2 border-[1px] border-slate-400 flex flex-row items-center justify-between desktop:w-[18vw] movil:w-[50vw] rounded bg-neutral-50">
                            <input
                                className="w-[38mm] pl-[2px] focus:outline-none rounded"
                                placeholder="Nota o Asunto..."
                                type="text"
                                value={inputSearch}
                                onChange={handleInputSearchChange}
                                onKeyPress={handleKeyPress}
                                translate='no'
                            ></input>
                            <div className="flex flex-row ">
                                <div>
                                    {(inputSearch!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer "
                                            onClick={()=>handleCancelSearch()}
                                        />
                                    }

                                </div>
                                <FaSearch 
                                    className="text-slate-400 cursor-pointer w-[5mm]"
                                    onClick={submitSearchDoc}
                                    id="botonSearch"
                                />
                            </div>
                        </div>
                    </div>
                    {(selectedRadioTipoDocRec==='historicos') &&
                    
                        <div className="text-sm flex flex-row ml-4 transition-all duration-500">
                            <button 
                                className={`border-[1px] rounded-l-lg px-[3px] transition-all duration-500 shadow-inner
                                    ${toggleButtonTipoHistorico
                                        ?`border-sky-400 bg-neutral-50 text-sky-600 shadow-none`
                                        :`border-slate-400 text-slate-400 `
                                    }`}
                                onClick={()=>setToggleButtonTipoHistorico(!toggleButtonTipoHistorico)}
                                translate='no'
                            >Mios</button>
                            <button 
                                className={`border-[1px]  rounded-r-lg px-[3px] transition-all duration-500 shadow-inner
                                    ${toggleButtonTipoHistorico
                                        ?`border-slate-400 text-slate-400`
                                        :`border-sky-400 bg-neutral-50 text-sky-600 shadow-none`
                                    }`}
                                onClick={()=>setToggleButtonTipoHistorico(!toggleButtonTipoHistorico)}
                                translate='no'
                            >Sector</button>
                        </div>
                    }
                </div>
            </div>
            

            {/* TABLA DE RESULTADOS DE DOCUMENTOS */}
            <div className={`desktop:w-[90vw] movil:w-full  border-2 border-slate-400 rounded-lg overflow-y-auto mt-2 transition-all duration-500 bg-neutral-50
            ${isDivOpcionesVisible 
                ?`desktop:h-[63vh] movil:h-[55vh]`
                :`desktop:h-[66vh] movil:h-[70vh]`
            }
                `}>
                <table className=" border-[1px] border-black bg-slate-50">
                    <thead>
                        <tr className="sticky top-0 text-[12px] bg-orange-200 text-black font-bold">
                            <th className="w-[16mm] border-[1px] " translate='no'
                            >Demora</th>
                            <th className="w-[10mm] border-[1px]"
                            >{(selectedRadioTipoDocRec=='actuales')?'Editar' :'Ver'}</th>
                            <th className="w-[25mm] h-[
                            10mm] border-[1px] border-slate-50" translate='no'>FECHA</th>
                            <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>NOTA</th>
                            <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>PERTINENTE</th>
                            <th className="w-[80mm] h-[10mm] border-[1px] border-slate-50" translate='no'>ASUNTO</th>
                            <th className="w-[28mm] h-[10mm] border-[1px] border-slate-50" translate='no'>ESTADO</th>
                            <th className="w-[30mm] h-[10mm] border-[1px] border-slate-50" translate='no'>DESTINO</th>
                            <th className="w-[30mm] h-[10mm] border-[1px] border-slate-50" translate='no'>RECIBIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            docRecFilter?.map((doc,index)=>{
                                const creaciondatetime = formateaFechaHora(doc.datetime_creacion);
                                const recibidodatetime = formateaFechaHora(doc.datetime_recibido);
                                const{formatFecha: creacionfecha, formatHora: creacionhora} = creaciondatetime;
                                const{formatFecha: recibidofecha, formatHora: recibidohora} = recibidodatetime;
                                const diasTranscurridos = calculateDiasHabilesTranscurridos(creacionfecha,recibidofecha,doc.id_estado)-1;
                                //const diasTranscurridos = calculateDaysElapsed(formatFecha);
                                return(
                                    <tr key={index} className="hover:bg-orange-100">
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-xs  p-2 justify-center ">
                                            <div>
                                                <div className="flex justify-center">
                                                    {getIcon(diasTranscurridos,doc.id_estado)}
                                                </div>
                                                <div className="text-xs flex justify-center" translate='no'>
                                                    {diasTranscurridos} dias
                                                </div>
                                            </div>
                                        </td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-lg  p-2 justify-center ">
                                            <div className="flex flex-col">
                                                {(userSG.permiso===1)
                                                    ?<FaEdit className="text-sky-500 hover:text-sky-500 hover:cursor-pointer mb-[2px]" onClick={()=>submitEditDoc(doc)} title="EDITAR DOCUMENTO"/>
                                                    :''
                                                }
                                                {(selectedRadioTipoDocRec=='actuales')
                                                    ?<FaFileExport onClick={()=>submitHandlerEdit(doc)} className="hover:text-orange-500 hover:cursor-pointer" title="GESTIONAR"/>
                                                    :<FaEye onClick={()=>submitHandlerEdit(doc)} className="hover:text-orange-500 hover:cursor-pointer" title="VER HISTORICO"/>
                                                }
                                            </div>
                                         </td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{creacionfecha} ({creacionhora})</td>
                                        {/* <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm">{formatArgFecha(creacionfecha)} ({creacionhora})</td> */}
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{doc.nota}</td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{doc.pertinente}</td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{(doc.origen==='' || doc.origen===null || doc.origen==='null') ?null :doc.origen} {(doc.fojas==='' || doc.fojas===null || doc.fojas==='null')?null :`(fs:${doc.fojas})`} {<br/>}{doc.asunto}</td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{doc.estado}</td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>{doc.nombre}</td>
                                        <td className="h-[10mm] border-[1px] border-b-slate-400 text-sm" translate='no'>
                                            {
                                                (doc.datetime_recibido) 
                                                ?`${recibidofecha} (${recibidohora}) ` 
                                                // ?`${formatArgFecha(recibidofecha)} (${recibidohora}) ` 
                                                :''
                                            }</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* MODAL DE DATOS HISTORICOS */}
            <ModalDatosHistoricos isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-5 w-100 h-100 ">
                    <label className="text-xl text-center font-bold mb-5" translate='no'>Movimientos Historicos del Documento</label>
                    <div className=" h-[40vh] border-2 border-slate-400 rounded-lg overflow-y-auto mt-2 flex desktop:justify-center items-start movil:overflow-x-auto movil:justify-start">
                        <table className=" border-[1px] border-black bg-slate-50">
                            <thead>
                                <tr className="sticky top-0 text-[12px] bg-orange-200 text-black font-bold">
                                    <th className="w-[25mm] h-[10mm] border-[1px] border-slate-50" translate='no'>FECHA</th>
                                    <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>ORIGEN</th>
                                    <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>DESTINO</th>
                                    <th className="w-[70mm] h-[10mm] border-[1px] border-slate-50" translate='no'>OBSERVACION</th>
                                    <th className="w-[30mm] h-[10mm] border-[1px] border-slate-50" translate='no'>ESTADO</th>
                                    <th className="w-[40mm] h-[10mm] border-[1px] border-slate-50" translate='no'>RECIBIDO</th>
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
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{movimientofecha} ({movimientohora})</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{mov.usuario_origen}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{mov.usuario_destino}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{mov.observaciones}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{mov.estado}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>
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
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={closeModal}
                            translate='no'
                        >OK</button>
                    </div>
                </div>
            </ModalDatosHistoricos>

            {/* MODAL DE EDITAR DOCUMENTO */}
            <ModalEdit isOpen={isOpenModalEdit} closeModal={closeModalEdit}>
                <div className="h-100 w-100  flex flex-col items-center">
                    <label 
                        className="text-xl text-center font-bold " 
                        translate='no'
                    >Datos del Documento</label>
                    <div className="flex flex-col ml-2 mt-2 w-[50vw]">
                        <div className="flex flex-row mb-2">
                            <div className="flex flex-col mx-2 items-start">
                                <label className="text-sm">Nota:</label>
                                <input 
                                    name="nota"
                                    className="border-[1px] border-zinc-400 w-[80mm] text-center"
                                    value={formDocumento.nota}
                                    onChange={handleChangeEdit}
                                />
                            </div>

                            <div className="flex flex-col mx-2 items-start">
                                <label className="text-sm">Pertinente</label>
                                <select 
                                    name="idPertinente"
                                    className="border-[1px] border-slate-400"
                                    value={formDocumento.idPertinente}
                                    onChange={handleChangeEdit}
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
                        
                        <div className="flex flex-row mb-2">
                            <div className="flex flex-col mx-2 items-start">
                                <label className="text-sm">Persona Fisica/Juridica:</label>
                                <input 
                                    name="origen"
                                    className="border-[1px] border-zinc-400 w-[80mm] pl-[2px]"
                                    value={formDocumento.origen}
                                    onChange={handleChangeEdit}
                                    //disabled={(datosVacante?.datetime_asignacion!=null)}
                                />
                            </div>
                            <div className="flex flex-col mx-2 items-start">
                                <label className="text-sm">Fs:</label>
                                <input 
                                    name="fojas"
                                    className="border-[1px] border-zinc-400 w-[20mm] pl-[2px]"
                                    value={formDocumento.fojas}
                                    onChange={handleChangeEdit}
                                    //disabled={(datosVacante?.datetime_asignacion!=null)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col mx-2 items-start">
                                <label className="text-sm">Asunto:</label>
                                <textarea
                                    name="asunto"
                                    type="text"
                                    className="border-[1px] border-slate-400 desktop:w-[49vw] h-[20vh] text-start px-[4px] movil:w-[80vw]"
                                    value={formDocumento.asunto}
                                    onChange={handleChangeEdit}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="w-[50vw] flex flex-row justify-center mt-4">
                            <button 
                    // className="font-bold text-base w-[40mm] h-[12mm] mx-2  bg-slate bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                                className={`font-medium text-base w-[40mm] h-[12mm] mx-2 mt-2 rounded
                                ${(validaForm)
                                    ?`bg-[#729DA6] text-white hover:bg-[#6A88F7] shadow-md`
                                    :`border-slate-300 bg-slate-200`
                                }
                                `}
                                //disabled={!(validaForm)}
                                onClick={submitGuardar}
                            >Guardar</button>
                            <button 
                    // className="font-bold text-base w-[40mm] h-[12mm] mx-2  bg-slate bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                                className={`font-medium text-base w-[40mm] h-[12mm] mx-2 mt-2 rounded bg-[#729DA6] text-white hover:bg-[#6A88F7] shadow-md
                                `}
                                //disabled={!(validaForm)}
                                onClick={submitCloseEdit}
                            >Cancelar</button>
                        </div>  
                    </div>
                </div>
            </ModalEdit>

            {/* MODAL NOTFICACIONES */}
            <Modal isOpen={isOpenModalNotif} closeModal={closeModalNotif}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModalNotif()}
                        >CERRAR</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default PrincipalUser;