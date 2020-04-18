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
import { getLastTimer, getTimerType, getLastTomato, postTimer, putTimer } from "./../service/Api";


class Tomatoes extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            timerPause: new EasyTimer(),
            timerTomato: new EasyTimer(),
            timerValuePause: "00:00:00",
            timerValueTomato: "00:00:00",
            type: '',
            startDate: '',
            startTimer: 0,
            selectPause: [],
            selectTomato: [],
            lastTomato: [],
            timerSelected: '',
            idTimerSelected: 0,
            idTimer: 0,
            status: '',
            titleValue: '',
            descriptionValue: '',
        }

        console.log(this.state.status);
    }

    async componentDidMount()
    {
        await this.initSelect();
        await this.controllLastTimer();
        await this.loadLastTomato();

        //Scorrimento e terminazione timer pause
        this.state.timerPause.addEventListener("secondsUpdated",(e)=>{
            this.setState({ timerValuePause: this.state.timerPause.getTimeValues().toString() });
        })

          this.state.timerPause.addEventListener('targetAchieved', (e) => {
            this.setState({ timerValuePause: '00:00:00', status:'done' });
          });

        //Scorrimento e terminazione timer tomato
        this.state.timerTomato.addEventListener("secondsUpdated",(e)=>{
            this.setState({ timerValueTomato: this.state.timerTomato.getTimeValues().toString() });
        })

          this.state.timerTomato.addEventListener('targetAchieved', (e) => {
            this.setState({ timerValueTomato: '00:00:00', status:'done' });
          });
    }

    componentDidUpdate()
    {
        if(this.state.status=='doing')
            this.startTimer(this.state.startTimer);
        else if(this.state.status=='done')
            this.putTimer('done');
        else if(this.state.status=='broken')
            this.putTimer('broken');
    }

    async controllLastTimer()
    {
        const result=await getLastTimer();
        
        result.data.map(value =>{
            console.log(value);
            if(value.status=='doing')
            {
                const diffDate=moment().diff(moment(value.start_date),'seconds');
                console.log("Diff:"+diffDate);
                if(diffDate>=value.duration*60)
                    this.setState({idTimer: value.id, timerSelected: value.duration, status: 'done'});
                else
                {
                    const diffDateSeconds=(value.duration*60)-diffDate;
                    console.log("DiffDateSeconds"+diffDateSeconds);
                    
                    this.setState({ idTimer: value.id, status: 'doing', startTimer: diffDateSeconds, type: value.type});
                }
            }
        });
    }

    /**
     * Inizializza le select della Pausa e dei Tomato
     */
    async initSelect()
    {
        const result=await getTimerType();
        const datePause=[];
        const dateTomato=[];
        result.data.map(item => {
            if(item.type=='pause')
                datePause.push(item);
            else if(item.type=='tomato')
                dateTomato.push(item);
        });

        this.setState({selectPause: datePause, selectTomato: dateTomato});
    }

    handleChangeSelect(event,obj)
    {
        this.setState({ timerSelected: obj.props.value , idTimerSelected: obj.props.id});
    }

    startTimer(second)
    {
        if(this.state.type=='pause')
            this.state.timerPause.start({ countdown: true, startValues: { seconds: second } });
        else if(this.state.type=='tomato')
            this.state.timerTomato.start({ countdown: true, startValues: { seconds: second } });
    }

    async playTimer(typeTimer)
    {
        if(this.state.timerSelected=='')
        {
            alert('Seleziona un timer');
            return;
        }
        if(typeTimer=='tomato'&&(this.state.titleValue==''||this.state.descriptionValue==''))
        {
            alert('Cosa fai... Avvii un tomato senza task? Compila il form!');
            return;
        }
        const result=await postTimer(moment(Date.now()).format(),this.state.idTimerSelected,this.state.titleValue,this.state.descriptionValue);

        if(result.status===200)
        {
            this.setState({idTimer: result.data.id, status: 'doing', startTimer: this.state.timerSelected*60, type: typeTimer, startDate: moment(result.data.start_date).format(), titleValue: '', descriptionValue: ''});
        }
    }

    async putTimer(status)
    {
        const date=this.state.status=='done' ? moment(this.state.startDate).add(this.state.timerSelected,'minutes') : (this.state.status=='broken' ? moment().format() : moment().format());
        const result=await putTimer(this.state.idTimer,date,status);
        
        if(result.status===204)
            this.setState({ status: '' });
    }

    /**
     * Recupera l'ultimo tomato
     */
    async loadLastTomato()
    {
        const result=await getLastTomato();
        if(result.status==200)
            this.setState({lastTomato: result.data[0]});
    }


    handleTitle(e)
    {
        this.setState({titleValue: e.target.value});
    }

    handleDescription(e)
    {
        this.setState({descriptionValue: e.target.value});
    }

    render () {
        const { classes } = this.props;
        const state=this.state;

        return (
            <React.Fragment >
                <Container maxWidth="lg">
                    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={3} md={3}>
                            <TimerPause select={
                                <Select onChange={this.handleChangeSelect.bind(this)}>
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
                        <Grid item xs={12} sm={6} md={6}>
                            <TimerTomato select={
                                    <Select onChange={this.handleChangeSelect.bind(this)}>
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
                                }/>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <TomatoForm inProgress={state.inProgress} titleValue={state.title} descriptionValue={state.description} lastTitle={state.lastTomato.title} lastDescription={state.lastTomato.description} handleTitle={this.handleTitle.bind(this)} handleDescription={this.handleDescription.bind(this)}/>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Tomatoes);