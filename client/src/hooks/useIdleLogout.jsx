import { useEffect, useRef } from "react"


export const useIdleLogout = (logoutFunction, timeout=30000)=>{
    const timeRef = useRef(null);

    const resetTimer=()=>{
        if(timeRef.current) clearTimeout(timeRef.current);
        timeRef.current=setTimeout(logoutFunction, timeout);
    };

    useEffect(()=>{
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

        const handleActivity = ()=> resetTimer();

        events.forEach((event)=>
            window.addEventListener(event, handleActivity)
        );
        resetTimer(); //Inicia temporizador primera vez

        return()=>{
            clearTimeout(timeRef.current);
            events.forEach((event)=>
                window.removeEventListener(event, handleActivity)
            )
        }
    },[logoutFunction,timeout]);

    return null;
};