import React from "react";
import { Grid, withStyles, Typography, Paper, Chip } from "@material-ui/core";
import DashboardTimer from "./../components/DashboardTimer";
import { TimerOff, Timer, AccessTime } from "@material-ui/icons";
import style from "./../components/DashboardTimerStyle";
import TableDashboard from "./../components/TableDashboard";
import moment from "moment";
import { getTasks } from "./../service/Api";
import FilterByDate from "./../components/FilterByDate";
import { SHOW_MESSAGE } from './../components/AlertCustomized';
import AlertCustomized from './../components/AlertCustomized';
import BackDropCustomized from "./../components/BackDropCustomized";
import { LOAD, REMOVE_LOAD } from "./../components/BackDropCustomized";

const TOMATO='tomato';
const PAUSE='pause';

class Dashboard extends React.Component {
    state = {
        idUser: JSON.parse( localStorage.getItem('timetoes_user') ).googleId,
        tasks: [],
        timeProductive: '00:00:00',
        timeBroken: '00:00:00',
        timeTotal: '00:00:00',
        selectedDate: moment().format('YYYY-MM-DD')
    };

    componentDidMount() {
        this.loadTasks();
    }

    loadTasks = async () => {
        try
        {
            window.EventBus.dispatchEvent(LOAD);
            const result=await getTasks( this.state.idUser, this.state.selectedDate );
            console.log(this.state.selectedDate);
            let totalProductive=moment().hours(0).minutes(0).seconds(0).milliseconds(0);
            let totalBroken=moment().hours(0).minutes(0).seconds(0).milliseconds(0);
            let total=moment().hours(0).minutes(0).seconds(0).milliseconds(0);

            if(result) {
                result.map(item => {
                    const dur=item.duration;
                    if( (item.type==TOMATO) && (item.status!='broken') )
                        totalProductive.add(dur.substr(0,2),'hours').add(dur.substr(3,2),'minutes').add(dur.substr(6,2),'seconds').format();
                    else if( (item.type==PAUSE) && (item.status!='broken') )
                        totalBroken.add(dur.substr(0,2),'hours').add(dur.substr(3,2),'minutes').add(dur.substr(6,2),'seconds').format();
                    if( item.status=='done' ) {
                        total.add(dur.substr(0,2),'hours').add(dur.substr(3,2),'minutes').add(dur.substr(6,2),'seconds').format();
                    }
              });
            }

            if(!result) {
                window.EventBus.dispatchEvent(SHOW_MESSAGE, { 
                    severity: 'warning', 
                    message: 'For now there are no tasks ... Make someone!' 
                });
            }

            this.setSeconds(result);

            this.setState({ tasks: result, 
                timeProductive: totalProductive.format('HH:mm:ss'),
                timeBroken: totalBroken.format('HH:mm:ss'),
                timeTotal: moment(total).format('HH:mm:ss')
            });
        }
        catch(err)
        {
            console.log(err);
        }
        finally {
            window.EventBus.dispatchEvent(REMOVE_LOAD);
        }

    }

    //Per problemi di ritardo con l'API, setto i secondi a 0
    setSeconds(tasks) {
        if(!Boolean(tasks)) {
            return;
        }
        tasks.map( item => {
            if( item.status != 'broken' ) {
                item.duration=item.duration.substr(0,3)+item.duration.substr(3,3)+"00";
            }
        });
    }

    handleDateChange = async (date) => {
        if(moment(date).isValid()) {
                await this.setState({ selectedDate: moment(date).format('YYYY-MM-DD') });
                await this.loadTasks();
        }
    }

    render () {
        const { classes } = this.props;
        const { tasks, timeBroken, timeProductive, timeTotal, selectedDate } = this.state;
        
        return (
            <React.Fragment>
                <BackDropCustomized />
                <AlertCustomized />
                <Grid 
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs={12} sm={12} md={6}>
                        <Typography className={classes.label}>
                            Daily Time
                        </Typography>
                    </Grid>
                </Grid>

                <Grid 
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
                >
                    <Grid item xs={12} sm={4} md={2}>
                        <DashboardTimer 
                            icon={<TimerOff className={classes.icon} />}
                            timer={timeBroken}
                            label={'Time in Pause'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <DashboardTimer 
                            icon={<Timer style={{ color: "#91D35E" }} className={classes.icon} />}
                            timer={timeProductive}
                            label={'Productive Time'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                    <DashboardTimer 
                        icon={<AccessTime className={classes.icon} />}
                        timer={timeTotal}
                        label={'Total Time'}
                    />
                </Grid>
                </Grid>
                <Grid 
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs={12} sm={12} md={2}>
                        <Typography className={classes.label}>
                            Tasks
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>

                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        {/*<Chip avatar={<DateRangeIcon fontSize="small" style={{ color: '#fff' }}/>} label="Filter by date" className={classes.filter}/>*/}
                        <FilterByDate handleDateChange={ this.handleDateChange } date={ selectedDate } />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs={12} sm={12} md={6}>
                        <TableDashboard tasks={tasks} />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Dashboard);