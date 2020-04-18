import React from "react";
import style from "./DashboardTimerStyle";
import { Paper, Typography, withStyles } from "@material-ui/core";

class DashboardTimer extends React.Component {
    render () {
        const { icon, timer, label, classes } = this.props;
        console.log(classes)

        return (
            <Paper 
                elevation={3} 
                className={classes.paper}>
                <Typography>
                    {icon}
                </Typography>
                <Typography className={classes.label}>
                    {label}
                </Typography>
                <Typography className={classes.timer}>
                    {timer}
                </Typography>
            </Paper>
        );
    }
}

export default withStyles(style)(DashboardTimer);