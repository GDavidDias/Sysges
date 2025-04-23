import { useEffect, useState } from "react";
import { fetchDocTot } from "../../utils/fetchDocTot";
import { fetchAllDocTotPertinente } from "../../utils/fetchAllDocTotPertinente";
import { FaDotCircle, FaSearch, FaEye } from "react-icons/fa";

import CircularChart from "../../utils/CircularChart.jsx";

import BarrasChart from "../../utils/BarrasChart.jsx";
import { fetchAllDocTotDemora } from "../../utils/fetchAllDocTotDemora.js";
import { useModal } from "../../hooks/useModal";
import ModalDatosHistoricos from "../ModalDatosHistoricos/ModalDatosHistoricos";


const Dashboard = () => {
    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");
    const[docTotalizados, setDocTotalizados]=useState([]);
    const[docTotPertinente, setDocTotPertinente]=useState([]);
    const[cantTotDoc, setCantTotDoc]=useState(0);
    
    const[datosTot, setDatosTos]=useState({
        Completado:0,
        EnCurso:0,
        Demorado:0
    });

    const[datosDemora, setDatosDemora]=useState({
        ceroados:0,
        tresacuatro:0,
        cincoanueve:0,
        mas10:0
    });

    const[datosDocDemora, setDatosDocDemora]=useState([]);
    const[filterDocDemora, setFilterDocDemora]=useState([]);

    const incrementa=(valor)=>{
         setCantTotDoc(cantTotDoc+valor);
    };

    const getDocumentosTotalizados = async()=>{
        const data = await fetchDocTot();
        //console.log('que trae fetchDocTot: ',data);

        const total = data.reduce((acc,item)=>acc+item.cantidad,0);
        setCantTotDoc(total);

        const nuevosDatos = { Completado: 0, EnCurso: 0, Demorado: 0 };

        if(data.length!=0){
            data.forEach((item)=>{

                const estadoKey = item.estado.replace(/\s+/g, '');
                if(nuevosDatos.hasOwnProperty(estadoKey)){
                    nuevosDatos[estadoKey]=item.cantidad;
                }
                //incrementa(item.cantidad);
            });
            setDatosTos(nuevosDatos);
        }
        setDocTotalizados(data);
    };

    const getDocumentosTotPertinente = async()=>{
        fetchAllDocTotPertinente
        const data = await fetchAllDocTotPertinente();
        //console.log('que trae fetchAllDocTotPertinente: ',data);
        setDocTotPertinente(data);
    };

    const clasificaDemora = async(data)=>{
        let newDatosDemora={
            ceroados:0,
            tresacuatro:0,
            cincoanueve:0,
            mas10:0
        };

        await data.forEach((item)=>{
            //console.log('que tiene item de data: ',item);
            const{formatoFecha}=formatoFechaHora(item.datetime_creacion);
            //console.log('que trae formatoFecha: ', formatoFecha);
            const dias = calculateDiasHabilesTranscurridos(formatoFecha)-1;
            //console.log('cuantos dias transcurrieron: ', dias);
            if(dias<=2){
                //console.log('==>QUE TIENE datosDemora.ceroados: ', newDatosDemora.ceroados);
                newDatosDemora.ceroados+=1;
                //console.log('==>COMO QUEDA datosDemora.ceroados: ', newDatosDemora.ceroados);
            }else if(dias>=3 && dias<=4){
                newDatosDemora.tresacuatro+=1;

            }else if(dias>=5 && dias<=9){
                newDatosDemora.cincoanueve+=1;

            }else if(dias>=10){
                newDatosDemora.mas10+=1;
            }
        });
        //console.log('que tiene newDatosDemora: ', newDatosDemora);

        setDatosDemora(newDatosDemora);
    };

    const getDocumentosTotDemora = async()=>{  
        //console.log('INGRESA A GETDOCUMENTOSTOTDEMORA');

        const data = await fetchAllDocTotDemora();
        //console.log('que trae fetchAllDocTotDemora: ', data);
        await clasificaDemora(data);
        //console.log('como QUEDA')
        setDatosDocDemora(data);
    };

    function formatoFechaHora2 (datetime){
        //console.log('que ingresa por datetime: ',datetime);
        const date = new Date(datetime);
        //console.log('en que formaea date: ', date);

        const formatoFecha = date.toISOString().slice(0,10);
        const formatoHora = date.toTimeString().slice(0,5);
        return{formatoFecha,formatoHora};
    };

    function formatoFechaHora (datetime){
        //console.log('que ingresa por datetime: ',datetime);
        const date = new Date(datetime);
        //console.log('en que formaea date: ', date);

        const formatoFecha = date.toISOString().slice(0,10);
        //const formatoHora = date.toTimeString().slice(0,5);
        return{formatoFecha};
    };

    function parseDateWithoutTimezone(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)); // Crear fecha en UTC
      }

    function calculateDiasHabilesTranscurridos(datestring_ini, datestring_fin){
        // console.log('EJECUTO FUNCION calculateDiasHabilesTranscurridos');
        // console.log('que ingresa por datestring_ini: ', datestring_ini);

        let startDate = parseDateWithoutTimezone(datestring_ini);
        //let startDate = (datestring_ini);
        //console.log('como convierte dateString a starDate: ', startDate)
        
        let currentDate = new Date();
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

    const clasificaDocDemora=async(datos,tipodemora)=>{
        let newFilterDocMora=[];
        // console.log('ingrsa a clasificaDocDemora');
        // console.log('que ingresa por datos: ', datos);
        // console.log('que ingresa por tipodemora: ', tipodemora);
        await datos.forEach((doc)=>{
            //console.log('que tiene item de data: ',item);
            const{formatoFecha}=formatoFechaHora(doc.datetime_creacion);
            //console.log('que trae formatoFecha: ', formatoFecha);
            const dias = calculateDiasHabilesTranscurridos(formatoFecha)-1;
            //console.log('cuantos dias transcurrieron: ', dias);
            if(dias<=2 && tipodemora=='ceroados'){
                newFilterDocMora.push(doc);
            }else if(dias>=3 && dias<=4 && tipodemora=='tresacuatro'){
                newFilterDocMora.push(doc);
            }else if(dias>=5 && dias<=9 && tipodemora=='cincoanueve'){
                newFilterDocMora.push(doc);
            }else if(dias>=10 && tipodemora=='mas10'){
                newFilterDocMora.push(doc);
            }
        });

        setFilterDocDemora(newFilterDocMora);
    };

    const handleOpenModal = (tipodemora)=>{
        //Con documentosTotDemora clasifico los documentos y los guardo en el array para mostrarlos
        //Traigo los datos y los guardo en 
        clasificaDocDemora(datosDocDemora,tipodemora);
        if(tipodemora=='ceroados'){
            setMensajeModalInfo('con Demora hasta 2 dias');
        }else if(tipodemora=='tresacuatro'){
            setMensajeModalInfo('con Demora entre 3 a 4 dias');
        }else if(tipodemora=='cincoanueve'){
            setMensajeModalInfo('con Demora entre 5 a 9 dias');
        }else if(tipodemora=='mas10'){
            setMensajeModalInfo('con Demora de mas de 10 dias');
        }
        openModal();
    };

    const clasificaDocEstado=async(datos,tipoestado)=>{
        let newFilterDocEstado;
        // console.log('ingresa a clasificaDocEstado');
        // console.log('que ingresa por datos: ', datos);
        // console.log('que ingresa por tipoestado: ', tipoestado);

        if( tipoestado=='encurso'){
            newFilterDocEstado=datos.filter(doc=>doc.id_estado==1);
        }else if( tipoestado=='demorado'){
            newFilterDocEstado=datos.filter(doc=>doc.id_estado==3);
        }
        
        setFilterDocDemora(newFilterDocEstado);    
    };    

    const handleOpenModalEstado = (tipoestado)=>{
        //Con documentosTotDemora clasifico los documentos y los guardo en el array para mostrarlos
        //Traigo los datos y los guardo en 
        clasificaDocEstado(datosDocDemora,tipoestado);
        if(tipoestado=='completado'){
            setMensajeModalInfo('Completados');
        }else if(tipoestado=='encurso'){
            setMensajeModalInfo('con Estado en Curso');
        }else if(tipoestado=='demorado'){
            setMensajeModalInfo('con Estado en Demora');
        }
        openModal();
    };

    useEffect(()=>{
        //console.log('que tiene filterDocMora: ', filterDocDemora);
    },[filterDocDemora])

    useEffect(()=>{
        //console.log('que tiene datosDocDemora: ', datosDocDemora);
    },[datosDocDemora])
    useEffect(()=>{
        //console.log('qe tiene datosDemora: ', datosDemora);
    },[datosDemora]);

    useEffect(()=>{
        //console.log('que hay en docTotalizados: ', docTotalizados);
    },[docTotalizados]);

    useEffect(()=>{
        //console.log('que hay en docTotPertinente: ',docTotPertinente);
    },[docTotPertinente]);

    useEffect(()=>{
        //console.log('cantidad de cantTotDoc: ',cantTotDoc);
    },[cantTotDoc])

    useEffect(()=>{
        //console.log('que tiene estado local datosTot: ',datosTot);
    },[datosTot])

    useEffect(()=>{
        
        console.log('Ingresa a Dashboard');
        //Llama a funcion para ejecutar consulta
        getDocumentosTotalizados();
        getDocumentosTotPertinente();
        getDocumentosTotDemora();
        
        const intervalId = setInterval(()=>{
            //Llama a funcion para ejecutar consulta
            getDocumentosTotalizados();
            getDocumentosTotPertinente();
            getDocumentosTotDemora();

        }, 10000);

        return()=>clearInterval(intervalId);

    },[]);

    return(
        <div className="notranslate flex flex-col items-center bg-gradient-to-br from-transparent via-neutral-50 to-slate-200">
            <div className="text-2xl text-[#557CF2] font-bold text-center my-4">
                <h1>PANEL DE METRICAS</h1>
            </div>
            <div className="flex flex-col ">
                <div className="flex desktop:flex-row  movil:flex-col">
                    <div className="flex flex-col justify-center  mr-2">
                        <label
                            className="text-lg font-bold"
                        >Estado de Documentos Totalizados</label>
                        <div className="flex desktop:flex-row desktop:mt-4 movil:flex-col desktop:items-center movil:items-center movil:mt-[2px] ">
                            <div className="flex justify-center items-center mt-2 border-2 border-slate-400 rounded-md p-[1px]">
                                <table className="flex flex-col items-start desktop:text-base movil:text-sm ">
                                    <thead>
                                        <tr>
                                            <th className="w-[28mm] border-[1px] border-b-slate-400 bg-amber-200" translate='no'>Estado</th>
                                            <th className="w-[20mm] border-[1px] border-b-slate-400 bg-amber-200" translate='no'>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="w-[28mm] border-[1px] border-y-slate-400">Completado</td>
                                            <td className="w-[20mm] border-[1px] border-y-slate-400">
                                                <div className="w-[19mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosTot.Completado} </label>
                                                    {/* {(datosTot.Completado!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModalEstado('completado')}
                                                        />
                                                    } */}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[28mm] border-[1px] border-y-slate-400">En Curso</td>
                                            <td className="w-[20mm] border-[1px] border-y-slate-400">
                                                <div className="w-[19mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosTot.EnCurso} </label>
                                                    {(datosTot.EnCurso!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModalEstado('encurso')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[28mm] border-[1px] border-y-slate-400">Demorado</td>
                                            <td className="w-[20mm] border-[1px] border-y-slate-400">
                                                <div className="w-[19mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosTot.Demorado} </label>
                                                    {(datosTot.Demorado!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModalEstado('demorado')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[28mm] border-[1px] border-t-slate-400 italic">Totales</td>
                                            <td className="w-[20mm] border-[1px] border-t-slate-400">{cantTotDoc}</td>
                                        </tr>
                                        {/* {
                                            datosTot?.map((total,index)=>(
                                                <tr key={index}>
                                                    <td className="w-[30mm] border-[1px] border-black">{total.estado}</td>
                                                    <td className="w-[25mm] border-[1px] border-black">{total.cantidad}</td>
                                                </tr>       
                                            ))
                                        } */}
                                    </tbody>
                                </table>
                            </div>
                            <div className="desktop:w-[20vw] desktop:h-[30vh] movil:w-[45vw] movil:h-[28vh] ">
                                {(docTotalizados.length!=0) &&
                                    <CircularChart datos={docTotalizados}/>
                                }
                            </div>
                        </div>
                    </div>
                    <div className=" ml-2 mb-4">
                        <label
                            className="text-lg font-bold"
                        >Demora Documentos Activos</label>
                        <div className="flex desktop:flex-row desktop:mt-4 movil:flex-col desktop:items-center movil:items-center movil:mt-[2px] desktop:justify-center movil:justify-center">
                            {/* TABLA */}
                            <div className="border-2 border-slate-400 rounded-md p-[1px]">
                                <table className="flex flex-col items-start desktop:text-base movil:text-sm">
                                    <thead>
                                        <tr>
                                            <th className="w-[25mm] border-[1px] border-b-slate-400 bg-indigo-200" >Demora</th>
                                            <th className="w-[21mm] border-[1px] border-b-slate-400 bg-indigo-200" >Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="w-[25mm] border-[1px] border-b-slate-400">0 a 2 dias</td>
                                            <td className="w-[21mm] border-[1px] border-b-slate-400 bg-green-300 font-bold ">
                                                <div className="w-[20mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosDemora.ceroados} </label>
                                                    {(datosDemora.ceroados!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModal('ceroados')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[25mm] border-[1px] border-b-slate-400">3 a 4 dias</td>
                                            <td className="w-[21mm] border-[1px] border-b-slate-400 bg-yellow-300 font-bold">
                                                <div className="w-[20mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosDemora.tresacuatro} </label>
                                                    {(datosDemora.tresacuatro!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModal('tresacuatro')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[25mm] border-[1px] border-b-slate-400">5 a 9 dias</td>
                                            <td className="w-[21mm] border-[1px] border-b-slate-400 bg-red-200 font-bold">
                                            <div className="w-[20mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosDemora.cincoanueve} </label>
                                                    {(datosDemora.cincoanueve!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-orange-600"
                                                            onClick={()=>handleOpenModal('cincoanueve')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-[25mm] border-[1px] border-t-slate-400">+ 10 dias</td>
                                            <td className="w-[21mm] border-[1px] border-t-slate-400 bg-red-400 font-bold">
                                            <div className="w-[20mm] flex flex-row items-center">
                                                    <label className="w-[75%]">{datosDemora.mas10} </label>
                                                    {(datosDemora.mas10!=0) &&
                                                        <FaEye 
                                                            className="w-[25%] cursor-pointer hover:scale-110 hover:text-red-800 "
                                                            onClick={()=>handleOpenModal('mas10')}
                                                        />
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* GRAFICO */}
                            {/* <div>
                                <div className="desktop:w-[20vw] desktop:h-[30vh] movil:w-[45vw] movil:h-[28vh] border-2 border-orange-500">
                                    {(docTotalizados.length!=0) &&
                                        <CircularChart datos={docTotalizados}/>
                                    }
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>
                <div className="flex flex-col justify-center  desktop:mt-6  movil:mt-[2px]  items-center ">
                    <label
                            className="text-lg font-bold"
                        >¿Cual es el Destino de los documentos?</label>
                    <div className="desktop:h-[35vh] desktop:w-[50vw] flex desktop:justify-center  movil:items-center movil:w-full movil:h-[35vh]">
                        {(docTotPertinente.length!=0) &&
                            <BarrasChart datos={docTotPertinente}/>
                        }
                    </div>
                </div>
            </div>

            {/* MODAL DE DATOS HISTORICOS */}
            <ModalDatosHistoricos isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-5 w-100 h-100 ">
                    <label className="text-xl text-center font-bold mb-5" >{`Documentos ${mensajeModalInfo}`}</label>
                    <div className=" h-[40vh] border-2 border-slate-400 rounded-lg overflow-y-auto mt-2 flex desktop:justify-center items-start movil:overflow-x-auto movil:justify-start">
                        <table className=" border-[1px] border-black bg-slate-50">
                            <thead>
                                <tr className="sticky top-0 text-[12px] bg-orange-200 text-black font-bold">
                                    <th className="w-[25mm] h-[10mm] border-[1px] border-slate-50" translate='no'>FECHA</th>
                                    <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>NOTA</th>
                                    <th className="w-[35mm] h-[10mm] border-[1px] border-slate-50" translate='no'>PERTINENTE</th>
                                    <th className="w-[70mm] h-[10mm] border-[1px] border-slate-50" translate='no'>ASUNTO</th>
                                    <th className="w-[30mm] h-[10mm] border-[1px] border-slate-50" translate='no'>DESTINO</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* datosMovDocSG / movDocOrder*/}
                                {
                                    filterDocDemora?.map((doc,index)=>{
                                        //console.log('que tiene doc: ',doc);
                                        const creaciondatetime = formatoFechaHora2(doc.datetime_creacion);
                                        // const recibidodatetime=formatoFechaHora(mov.datetime_recibido);
                                        const{formatoFecha: creacionfecha, formatoHora: creacionhora} = creaciondatetime;
                                        // const{formatoFecha: recibidofecha, formatoHora: recibidohora} = recibidodatetime;
                                        return(
                                            <tr className="text-sm" key={index}>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{creacionfecha} ({creacionhora})</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{doc.nota}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{doc.pertinente_descripcion}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{doc.asunto}</td>
                                                <td className="h-[10mm] border-[1px] border-b-slate-300" translate='no'>{doc.usuario_destino}</td>
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

        </div>
    )
};

export default Dashboard;