import React from "react";
import { Paper, Typography, Grid, withStyles } from "@material-ui/core";
import stylePause from "./TimerPauseStyle";

class TimerPause extends React.Component {

    render () {
        const { select, label, timer, iconPlay, iconBroken, classes } = this.props;

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
                    <Grid item xs={6} sm={6} md={6} >
                        {iconPlay}
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                        {iconBroken}
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(stylePause)(TimerPause);