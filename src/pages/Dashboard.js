import React from "react";
import { Grid, withStyles, Typography, Paper, Chip } from "@material-ui/core";
import DashboardTimer from "./../components/DashboardTimer";
import { TimerOff, Timer, AccessTime } from "@material-ui/icons";
import style from "./../components/DashboardTimerStyle";
import axios from "axios";
import TableDashboard from "./../components/TableDashboard";
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from "moment";
import { getTasks } from "./../service/Api";

class Dashboard extends React.Component {
    state = {
        tasks: []
    };

    componentDidMount () {
        this.loadtasks();
    }

    async loadtasks()
    {
        const result=await getTasks(moment().format());

        if(result.status==200)
            this.setState({ tasks: result.data});
    }
    render () {
        const { classes } = this.props;
        const { tasks, tasksTimerInBroken, tasksTimerInProductive } = this.state;
        
        return (
            <React.Fragment>
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
                            timer={'00:00:00'}
                            label={'Time in Broken'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <DashboardTimer 
                            icon={<Timer style={{ color: "#91D35E" }} className={classes.icon} />}
                            timer={'00:00:00'}
                            label={'Productive Time'}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                    <DashboardTimer 
                        icon={<AccessTime className={classes.icon} />}
                        timer={'12:33:33'}
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
                        <Chip avatar={<DateRangeIcon fontSize="small" style={{ color: '#fff' }}/>} label="Filter by date" className={classes.filter}/>
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