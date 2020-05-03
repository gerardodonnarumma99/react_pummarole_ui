import React from "react";
import { Grid, Paper, TextField, Container, withStyles, Button, Select, MenuItem} from "@material-ui/core";
import style from "./../components/TomatoesStyle";
import TimerPause from "./../components/TimerPause";
import TimerTomato from "./../components/TimerTomato";
import TomatoForm from "./../components/TomatoForm";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import EasyTimer from "easytimer.js";
import moment from "moment";
import { getLastTimer, getTimerType, postTimer, putTimer, getNextTimer, getPomodoroCycle } from "./../service/Api";
import { SHOW_MESSAGE, SHOW_NEXT_TIMER, REMOVE_NEXT_TIMER } from './../components/AlertCustomized';
import AlertCustomized from "./../components/AlertCustomized";
import NotifyBrowser from './../components/NotifyBrowser';
import AlarmIcon from '@material-ui/icons/Alarm';
import IconButton from '@material-ui/core/IconButton';
import BackDropCustomized from "./../components/BackDropCustomized";
import { LOAD, REMOVE_LOAD } from "./../components/BackDropCustomized";

import Alert from '@material-ui/lab/Alert';
import EventBus from './../components/EventBus';

class Tomatoes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: JSON.parse( localStorage.getItem('timetoes_user') ).googleId,
            timerPause: new EasyTimer(),
            timerTomato: new EasyTimer(),
            timerValuePause: "00:00:00",
            timerValueTomato: "00:00:00",
            type: '',
            startDate: '',
            startTimer: 0,
            selectPause: [],
            selectTomato: [],
            //timerSelected: '',
            //idTimerSelected: 0,
            idTimer: 0,
            status: '',
            titleValue: '',
            descriptionValue: '',
            cycle: false,
            tomatoSelected : {
                id: 0,
                value: ''
            },
            pauseSelected : {
                id: 0,
                value: ''
            },

        }
    }

    async componentDidMount() {
        try{
            window.EventBus.dispatchEvent(LOAD);
            await this.initSelect();
            await this.controllLastTimer(this.state.userId);
            await this.pomodoroCycle();
        }
        catch(error){}
        finally {
            window.EventBus.dispatchEvent(REMOVE_LOAD);
        }

        //Scorrimento e terminazione timer pause
        this.state.timerPause.addEventListener("secondsUpdated",(e)=>{
            this.setState({ timerValuePause: this.state.timerPause.getTimeValues().toString() });
        })

        this.state.timerPause.addEventListener('targetAchieved', (e) => {
            this.setState({ timerValuePause: '00:00:00', status:'done' });
            this.notifyMe();
        });

        //Scorrimento e terminazione timer tomato
        this.state.timerTomato.addEventListener("secondsUpdated",(e)=>{
            this.setState({ timerValueTomato: this.state.timerTomato.getTimeValues().toString() });
        })

        this.state.timerTomato.addEventListener('targetAchieved', (e) => {
            this.setState({ timerValueTomato: '00:00:00', status:'done', titleValue: '', descriptionValue: '' });
            this.notifyMe();
        });
    }

    async componentDidUpdate() {
        const nextTimer = await getNextTimer(this.state.userId);

        switch (this.state.status) {
            case 'doing': 
                    this.startTimer(this.state.startTimer); 
                    Boolean(nextTimer) ?
                    window.EventBus.dispatchEvent(SHOW_NEXT_TIMER, { severity: 'info', message: `Next timer: ${nextTimer.duration} min ${nextTimer.type}`, timer: this.state.startTimer })
                    : window.EventBus.dispatchEvent(SHOW_NEXT_TIMER, { severity: 'info', message: 'Al momento non abbiamo suggerimenti per te!' });
                break;
            case 'done': 
                    this.putTimer(this.state.status); 
                    window.EventBus.dispatchEvent(REMOVE_NEXT_TIMER);
                    await this.pomodoroCycle();
                break;
            case 'broken': 
                    window.EventBus.dispatchEvent(REMOVE_NEXT_TIMER);
                    this.putTimer(this.state.status); 
                break;
        }
    }

    async controllLastTimer() {
        const timer = await getLastTimer(this.state.userId);
        
        if (timer.status === 'doing') {
            const diffDate = moment().diff(moment(timer.start_date),'seconds');
            
            if(diffDate >= timer.duration * 60) {
                console.log("QUI");
                this.setState({idTimer: timer.id, startDate: timer.start_date, startTimer: timer.duration, status: 'done'});
            } else {
                const diffDateSeconds = (timer.duration * 60) - diffDate;
                this.setState({ 
                    idTimer: timer.id, 
                    status: 'doing', 
                    startTimer: diffDateSeconds, 
                    type: timer.type,
                    titleValue: timer.title,
                    descriptionValue: timer.description
                });
            }
        }
    }

    /**
     * Inizializza le select della Pausa e dei Tomato
     */
    async initSelect() {
        const timerTypes = await getTimerType(this.state.userId);

        this.setState({
            selectPause: timerTypes.filter(item => item.type === 'pause'),
            selectTomato: timerTypes.filter(item => item.type === 'tomato')
        });
    }

    handleChangeSelectTomato(event, obj) {
        //this.setState({ timerSelected: obj.props.value , idTimerSelected: obj.props.id});
        this.setState({ tomatoSelected: {
            id: obj.props.id,
            value: obj.props.value
        }})
    }

    handleChangeSelectPause(event, obj) {
        this.setState({ pauseSelected: {
            id: obj.props.id,
            value: obj.props.value
        }}) 
    }

    startTimer(second) {
        if (this.state.type == 'pause')
            this.state.timerPause.start({ countdown: true, startValues: { seconds: second } });
        
        if (this.state.type == 'tomato')
            this.state.timerTomato.start({ countdown: true, startValues: { seconds: second } });
    }

    async pomodoroCycle() {
        const cyclePomo = await getPomodoroCycle(this.state.userId);

        if(cyclePomo) {
            window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'success', message: 'Complimenti... Hai completato un ciclo di pomodoro!' });
        }

        this.setState({ cycle: cyclePomo ? true : false });
    }

    async playTimer(typeTimer) {

        //Precondition Tomato
        if(typeTimer == 'tomato' && 
            (this.state.titleValue == '' || this.state.descriptionValue == '')) {
                window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: 'To run a tomato you have to perform a task!' });
                return;
        }
        //End Precondition Tomato

        if( (typeTimer=='tomato') && (this.state.tomatoSelected.value!='') ) {
            const result = await postTimer(
                moment(Date.now()).format(),this.state.userId,this.state.tomatoSelected.id,this.state.titleValue,this.state.descriptionValue, this.state.cycle
            );

            this.setState({
                idTimer: result.id, 
                status: 'doing', 
                startTimer: this.state.tomatoSelected.value*60, 
                type: typeTimer, 
                startDate: moment(result.start_date).format()
            });
        } 
        else if( (typeTimer=='pause') && (this.state.pauseSelected.value!='') ) {
            const result = await postTimer(
                moment(Date.now()).format(),this.state.userId,this.state.pauseSelected.id,'','', this.state.cycle
            );

            this.setState({
                idTimer: result.id, 
                status: 'doing', 
                startTimer: this.state.pauseSelected.value*60, 
                type: typeTimer, 
                startDate: moment(result.start_date).format()
            });
        }
        else {
            window.EventBus.dispatchEvent(SHOW_MESSAGE, { severity: 'error', message: 'Select a timer!' });
        }
    }

    async putTimer(status) {
        const { startDate, startTimer } = this.state;

        console.log("PUT",startDate);

        const date = status == 'done' ? moment(startDate).add(startTimer ,'seconds').format() : moment().format();

        try { 
            await putTimer(this.state.idTimer, date, status);
            this.setState({ status: '', titleValue: '', descriptionValue: '' });
        } catch (e) {}
    }

    notifyMe = () => {
        if (!("Notification" in window)) {
          alert("Your browser not supported the notifications");
        }
        else if (Notification.permission === "granted") {
          
          var notification = new Notification("Timer terminated!");
        } 
        else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            
            if (permission === "granted") {
                var notification = new Notification("Timer terminated!");
            }
          });
        }
      }

    handleTitle(e) {
        this.setState({titleValue: e.target.value});
    }

    handleDescription(e) {
        this.setState({descriptionValue: e.target.value});
    }

    render () {
        const { classes } = this.props;
        const state=this.state;

        return (
            <React.Fragment >
                <BackDropCustomized />
                <AlertCustomized />
                <NotifyBrowser />
                <Container maxWidth="lg">
                    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={12} md={3}>
                            <TimerPause select={
                                <Select onChange={this.handleChangeSelectPause.bind(this)}>
                                {state.selectPause.map(item => {
                                    return(<MenuItem id={item.id} value={item.duration}>{item.description}</MenuItem>);
                                })}
                                </Select>
                            } label={'Pause'} timer={state.timerValuePause} iconPlay={
                                <Button className={classes.buttonIcon} onClick={(e)=>{
                                    this.playTimer('pause');
                                }} disabled={this.state.timerPause.isRunning()||this.state.timerTomato.isRunning()}>
                                <PlayArrowIcon className={classes.iconPause} />
                            </Button>
                            } iconBroken={
                                <Button className={classes.buttonIcon} onClick={(e)=>{
                                    this.state.timerPause.stop();
                                    this.setState({timerValuePause: '00:00:00', status: 'broken'});
                                 }} disabled={!this.state.timerPause.isRunning()||this.state.timerTomato.isRunning()}>
                                    <CloseIcon className={classes.iconPause}/>
                                </Button>
                            }/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TimerTomato select={
                                    <Select onChange={this.handleChangeSelectTomato.bind(this)}>
                                    {state.selectTomato.map(item => {
                                        return(<MenuItem id={item.id} value={item.duration}>{item.description}</MenuItem>);
                                    })}
                                </Select>
                                } label={'Tomato'} timer={state.timerValueTomato} iconPlay={
                                    <Button className={classes.buttonIcon} onClick={(e)=>{
                                        this.playTimer('tomato');
                                    }} disabled={this.state.timerPause.isRunning()||this.state.timerTomato.isRunning()}>
                                    <PlayArrowIcon className={classes.iconTomato} />
                                </Button>
                                } iconBroken={
                                    <Button className={classes.buttonIcon} onClick={(e)=>{
                                        this.state.timerTomato.stop();
                                        this.setState({timerValueTomato: '00:00:00', status: 'broken'});
                                    }} disabled={this.state.timerPause.isRunning()||!this.state.timerTomato.isRunning()}>
                                        <CloseIcon className={classes.iconTomato}/>
                                    </Button>
                                }
                                iconCycle={
                                    <Button color="primary" 
                                        onClick={ async (e) => {
                                            await this.setState({ 
                                                tomatoSelected: {
                                                        id: 1,
                                                        value: 2
                                                },
                                                cycle: true
                                            });
                                            this.playTimer('tomato');
                                            }
                                        }
                                        disabled={this.state.timerPause.isRunning()||this.state.timerTomato.isRunning()}>
                                        New Cycle
                                    </Button>
                                }
                                />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            <TomatoForm 
                                idUser={state.idUser}
                                activeTimerTomato={state.timerTomato.isRunning()}
                                activeTimerPause={state.timerPause.isRunning()}
                                titleValue={state.titleValue} 
                                descriptionValue={state.descriptionValue}
                                handleTitle={this.handleTitle.bind(this)} 
                                handleDescription={this.handleDescription.bind(this)}/>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Tomatoes);