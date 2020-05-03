import React from "react";
import { Paper, Typography, Grid, withStyles } from "@material-ui/core";
import styleTomato from "./TimerTomatoStyle";

class TimerTomato extends React.Component {

    render () {
        const { select, label, timer, iconPlay, iconBroken, iconCycle, classes } = this.props;

        return (
            <Paper 
                elevation={3} 
                className={classes.paper}>
                    {select}
                <Typography className={classes.label}>
                    {label}
                </Typography>
                <Typography className={classes.timer}>
                    {timer}
                </Typography>
                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={3} sm={3} md={4} >
                        {iconPlay}
                    </Grid>
                    <Grid item xs={3} sm={3} md={4}>
                        {iconBroken}
                    </Grid>
                    <Grid item xs={3} sm={3} md={4}>
                        {iconCycle}
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styleTomato)(TimerTomato);