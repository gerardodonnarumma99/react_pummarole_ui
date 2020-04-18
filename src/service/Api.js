import axios from "axios";
const TOMATOS_API = 'http://127.0.0.1:8000/api/v1';

const IDUSER= 1; //Momentaneamente

/**
 * Recupera l'ultimo timer
 */
const getLastTimer=async() =>
{
    try
    {
        const result=await axios.get(`${TOMATOS_API}/timer/${IDUSER}`);

        return result;
    }
    catch(error)
    {
        console.log(error);
    }
}

/**
 * Recupera i vari tipi di timer
 */
const getTimerType=async() =>
{
    try
    {
        const result=await axios.get(`${TOMATOS_API}/timersTypes`);

        return result;
    }
    catch(error)
    {
        console.log(error);
    }
}

const getLastTomato=async() =>
{
    try
    {
        const result=await axios.get(`${TOMATOS_API}/tomatos/${IDUSER}`);

        return result;
    }
    catch(error)
    {
        console.log(error);
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
const postTimer=async(startDate,idTimerType,title,description) =>
{
    try
    {
        const result=await axios.post(TOMATOS_API+'/timer', {
            "user_id":1,
            "start_date":startDate,
            "end_date":"",
            "status":"doing",
            "timer_type":idTimerType,
            "title":title,
            "description":description,
            "first_cycle":"no"
        });

        return result;
    }
    catch(error)
    {
        console.log(error);
    }
}

/**
 * Invia una modifica di un timer
 * @param {Id del timer} idTimer 
 * @param {Data di fine del timer} endDate 
 * @param {Stato finale del timer} status 
 */
const putTimer=async(idTimer,endDate,status) =>
{
    try
    {
        const result=await axios.put(TOMATOS_API+'/timer/'+idTimer, {
            "end_date": endDate,
            "status": status
          });

        return result;
    }
    catch(error)
    {
        console.log(error);
    }
}

/**
 * Recupera i tasks di una determinata data
 * @param {Data dei tasks} date 
 */
const getTasks = async (date) => {
    try {
        const result = await axios.get(`${TOMATOS_API}/lastEvent/${IDUSER}/${date}`);
        
        return result;
    } catch (e) {
        console.log(e);
    }
}


export { getLastTimer, getTimerType, getLastTomato, postTimer, putTimer, getTasks };