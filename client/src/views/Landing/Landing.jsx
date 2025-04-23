import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from '../../assets/JUNTA-04.png';
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { conexion } from "../../utils/conexion";
import { outUser, setUser } from "../../redux/userSlice";
import { useModal } from "../../hooks/useModal";
import ModalUser from "../../components/ModalUser/ModalUser";
import Modal from "../../components/Modal/Modal";
import { changepass } from "../../utils/changepass";
import backgroundImage from '../../assets/fondo1.png';

const Landing = () =>{

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo] = useState("");

    const[isOpenModalChangePass,openModalChangePass,closeModalChangePass]=useModal(false);
    const[mensajeErrorModalChangeInfo, setMensajeErrorModalChangeInfo] = useState("");
    const[errorValida, setErrorValida] = useState(false);

    const[ver,setVer]=useState(false);
    const[form,setForm]=useState({
        username:'',
        password:''
    });

    const[formChangePass, setFormChangePass]=useState({
        username:'',
        password:'',
        newpassword:''
    });

    const handleVer=()=>{
        setVer(!ver);
    };

    const handleChange = (event)=>{
        const{name,value} = event.target;
        //console.log(name, value)
        if(name=='username'){
            setForm({...form,[name]:value.toUpperCase()});
        }
        if(name=='password'){
            setForm({...form,[name]:value});
        }
    };

    const handleKeyPress = (event)=>{
        if(event.key==='Enter'){
            document.getElementById("botonEnter")?.click();
            //submitHandler();
        }
    };

    const submitHandler = async()=>{
        const datavalida = await conexion(form);
        if(datavalida.length!=0){
            dispatch(setUser(datavalida));
            navigate('/home');
        }else{
            dispatch(outUser());
        }
    };

    const handleChangePass = (event) =>{
        const{name, value} = event.target;
        setFormChangePass({
            ...formChangePass,
            [name]:value
        })
    };

    const ModalChangePass = ()=>{
        setForm({
            username:'',
            password:''
        })
        openModalChangePass();
        setMensajeErrorModalChangeInfo('Con usuario y contraseña actual');
        setErrorValida(false);
    };

    //PRESIONO BOTON ACEPTAR DE MODALUSER CAMBIO CONTRASEÑA
    const submitAceptarChangePass =async()=>{
        if(formChangePass.newpassword===''){
            setMensajeErrorModalChangeInfo('Ingrese una Nueva Contraseña');
            setErrorValida(true);
        }else{
            const datavalida = await conexion(formChangePass);
            if(datavalida.length!=0){
                //dispatch(setUser(datavalida));
                //SI VALIDA USUARIO
                
                const result = await changepass(formChangePass);
                if(result.length!=0){
                    //llamo a modal mensaje cambio correcto, ingrese a sistema.
                    setMensajeModalInfo('Cambio de contraseña exitoso, ingrese al sistema');
                    openModal();
                }
                
            }else{
                setMensajeErrorModalChangeInfo('Usuario o Contraseña Invalido');
                setErrorValida(true);
                dispatch(outUser())
            }
        }
    };

    const submitCloseModal = ()=>{
        closeModal();
        closeModalChangePass();
        setFormChangePass({
            username:'',
            password:'',
            newpassword:''
        })
    };

    const CancelChangePass = ()=>{
        setFormChangePass({
            username:'',
            password:'',
            newpassword:''      
        })
        closeModalChangePass();
    };

    return(
        // <div className="h-[98vh] bg-[#FFFEFC]">
        <div 
            //PARA FONDO GRADIENTE SOLO
            // className="h-[100vh]  flex flex-col items-center bg-gradient-to-tl from-indigo-300 via-sky-100 to-orange-400"

            //PARA FONDO CON ANIMACION GRADIENTE
            className="h-[100vh]  flex flex-col items-center bg-animated-gradient bg-600% animate-gradient-bg"

            //PARA FONDO CON IMAGEN FIJA
            // style={{backgroundImage:`url(${backgroundImage})`}}
        >
        <div className="h-[15vh] flex flex-row justify-center items-center bg-[#729DA6] border border-b-slate-400 w-full shadow-md ">
            <div className="desktop:w-[90px] desktop:h-[90px] movil:w-[80px] movil:h-[80px] flex justify-center ">
                <img className="desktop:w-[90px] desktop:h-[90px] movil:w-[80px] movil:h-[80px]" src={logo}/>
            </div>
            <div className="h-28  flex flex-col pl-4 justify-center">
                <label className="text-[38px]  font-bold text-white" translate='no'>SYSGES</label>
                <label className="text-[13px] text-white" translate='no'>Sistema Gestion Documentos</label>
            </div>
        </div>
        <div className="desktop:h-[50vh] flex flex-col justify-center items-center  bg-[#FFFEFC]  border-2 border-[#729DA6] desktop:w-[50vw] movil:w-full movil:h-[50vh] rounded-lg mt-10 shadow-lg  p-4">
            <label className="text-[#729DA6] font-medium text-[20px] pt-4 " translate='no'>Ingresar al Sistema</label>
            <div className="flex flex-row my-6">
                <div className="flex flex-col text-right movil:w-[28vw] desktop:w-[15vw]">
                    <label className="m-2 " translate='no'>Nombre de usuario</label>
                    <label className="m-2 " translate='no'>Contraseña</label>
                </div>
                <div className="flex flex-col justify-end">
                    <input
                        className="m-2 border-[1px] border-black rounded px-2 w-[200px]"
                        value={form.username}
                        onChange={handleChange}
                        name="username"
                        type="text"
                    ></input>
                    <div className="flex flex-row items-center">
                        <input
                            className="m-2 border-[1px] border-black rounded px-2 w-[200px]"
                            value={form.password}
                            onChange={handleChange}
                            name="password"
                            type={ver ? 'text' :'password'}      
                            onKeyPress={handleKeyPress}
                        ></input>
                        <IoMdEyeOff onClick={()=>handleVer()}/>
                    </div>
                </div>
            </div>
            <label
                className="text-sky-500 hover:text-sky-800 hover:cursor-pointer"
                onClick={()=>ModalChangePass()}
            >Cambiar Contraseña</label>
            <button
                className="w-40 h-8 bg-[#729DA6] my-2 px-2 py-1 text-base font-medium text-white hover:bg-[#6A88F7] shadow-md rounded"
                onClick={submitHandler}
                translate='no'
                id="botonEnter"
            >Acceder</button>
        </div>


        {/* MODAL PARA CAMBIO CONTRASEÑA */}
        <ModalUser isOpen={isOpenModalChangePass} closeModal={closeModalChangePass}>
                <div className="mt-4 mb-4 w-72">
                    <h1 className="text-xl text-center font-bold">Cambiar Contraseña</h1>
                    <label 
                        className={`italic
                                ${(errorValida)
                                    ?`text-red-500`
                                    :`text-black`
                                }
                            `}
                    >{mensajeErrorModalChangeInfo}</label>
                    <div className="flex flex-col items-center ">
                        <div className="mt-4 flex flex-col items-start">
                            <label>Usuario: </label>
                            <input
                                name="username"
                                type="text"
                                className="border-[1px] border-gray-400 h-[10mm] w-[62mm] pl-2 focus:outline-none"
                                value={formChangePass.username}
                                onChange={handleChangePass}
                            ></input>
                        </div>
                        <div className="mt-4 flex flex-col items-start">
                            <label>Contraseña Actual:</label>
                            <div className="flex flex-row items-center border-[1px] border-gray-400 h-[11mm] w-[62mm] ">
                                <input
                                    name="password"
                                    type={ver ?'text' :'password'}
                                    className="h-[10mm] w-[52mm] ml-2 focus:outline-none"
                                    value={formChangePass.password}
                                    onChange={handleChangePass}
                                ></input>
                                <IoMdEyeOff onClick={()=>handleVer()} className="text-xl"/>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-start">
                            <label>Nueva Contraseña:</label>
                            <div className="flex flex-row items-center border-[1px] border-gray-400 h-[11mm] w-[62mm] ">
                                <input
                                    name="newpassword"
                                    type={ver ?'text' :'password'}
                                    className="h-[10mm] w-[52mm] ml-2 focus:outline-none"
                                    value={formChangePass.newpassword}
                                    onChange={handleChangePass}
                                ></input>
                                <IoMdEyeOff onClick={()=>handleVer()} className="text-xl"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-4">
                        <button
                            className="border-2 border-[#729DA6] my-2 font-medium w-40 h-8 bg-[#729DA6] text-white hover:bg-[#6A88F7] rounded"
                            onClick={()=>submitAceptarChangePass()}
                            >Aceptar</button>
                        <label
                            className="text-sky-500 hover:text-sky-800 hover:cursor-pointer"
                            onClick={()=>CancelChangePass()}
                        >Cancelar</label>
                    </div>
                </div>
            </ModalUser>

            {/* MODAL DE MENSAJES */}
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#729DA6] mt-10 font-bold w-40 h-8 bg-[#729DA6] text-white hover:bg-[#6A88F7] "
                            onClick={()=>submitCloseModal()}
                        >OK</button>
                    </div>
                </div>
            </Modal>
    </div>
    )
};

export default Landing;