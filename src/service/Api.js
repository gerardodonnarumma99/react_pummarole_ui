import axios from "axios";
import EventBus from "../components/EventBus";
import { SHOW_MESSAGE } from "../components/AlertCustomized";
import { LOAD, REMOVE_LOAD } from "./../components/BackDropCustomized";

const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';

const profil = JSON.parse( localStorage.getItem('timetoes_user') );
var IDUSER = Boolean(profil) ? profil.googleId : null; //Momentaneamente

/**
 * Recupera l'ultimo timer
 */
const getLastTimer = async(idUser) => {
    try {
        const result=await axios.get(`${TOMATOS_API}/timer/${idUser}`);
        return result.data[0];
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}

/**
 * Recupera i vari tipi di timer
 */
const getTimerType = async() => {
    try {
        const result=await axios.get(`${TOMATOS_API}/timersTypes`);
        return result.data;
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}

const getLastTomato = async(idUser) => {
    try {
        const result = await axios.get(`${TOMATOS_API}/tomatos/${idUser}`);
        return result.data[0];
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}

/**
 * 
 * Invia un timer
 * @param {Data di avvio del timer} startDate 
 * @param {Id del tipo di timer} idTimerType
 * @param {Titolo del task (null se è una pausa)} title 
 * @param {Descrizione del task (null se è una pausa)} description 
 */
const postTimer = async(startDate,idUser,idTimerType,title,description,cycle) => {
    try {
        window.EventBus.dispatchEvent(LOAD);
        const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":idUser,
            "start_date":startDate,
            "end_date":"",
            "status":"doing",
            "timer_type":idTimerType,
            "title":title,
            "description":description,
            "first_cycle": cycle ? 'yes' : 'no'
        });

        return result.data;
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
    finally {
        window.EventBus.dispatchEvent(REMOVE_LOAD);
    }
}

/**
 * Invia una modifica di un timer
 * @param {Id del timer} idTimer 
 * @param {Data di fine del timer} endDate 
 * @param {Stato finale del timer} status 
 */
const putTimer = async(idTimer,endDate,status) => {
    console.log(endDate);
    try {
        window.EventBus.dispatchEvent(LOAD);
        const result=await axios.put(TOMATOS_API+'/timer/'+idTimer, {
            "end_date": endDate,
            "status": status
        });

        return result;
    } catch(error) {
        console.log("Error",error);
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
    finally {
        window.EventBus.dispatchEvent(REMOVE_LOAD);
    }
}

/**
 * Recupera i tasks di una determinata data
 * @param {Data dei tasks} date 
 */
const getTasks = async (idUser,date) => {
    try {
        const result = await axios.get(`${TOMATOS_API}/lastEvent/${idUser}/${date}`);

        return result.data;
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}

/**
 * Recupera il prossimo timer, se rispetta il pattern altrimenti non torna nulla
 */
const getNextTimer = async(idUser) => {
    try {
        const result=await axios.get(`${TOMATOS_API}/nextTimer/${idUser}`);
        return result.data[0];
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}

/**
 * Ritorna true se c'è un ciclo, false altrimenti
 */
const getPomodoroCycle = async(idUser) => {
    try {
        const result=await axios.get(`${TOMATOS_API}/pomodoroCycle/${idUser}`);
        return result.data;
    } catch(error) {
        window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: "Connessione con il server fallita!" });
    }
}



export { getLastTimer, getTimerType, getLastTomato, postTimer, putTimer, getTasks, getNextTimer, getPomodoroCycle };