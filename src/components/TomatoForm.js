import React from "react";
import { Paper, TextField, Grid, Typography, withStyles } from "@material-ui/core";
import style from "./TomatoFormStyle";
import { getLastTimer, getLastTomato } from "../service/Api";
import FormActive from './FormActive';

class TomatoForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastTomato: [],
            lastTimer: []
        };
    }

    async componentDidMount () {
        const tomato = await getLastTomato(this.props.userId);
        const timer = await getLastTimer(this.props.userId);
        this.setState({lastTomato: tomato, lastTimer: timer});
    }

    render () {
        const { 
            activeTimerTomato, activeTimerPause, titleValue, descriptionValue, handleTitle, handleDescription, classes } = this.props;
        const { lastTomato, lastTimer } = this.state;

        return (
            <React.Fragment>
                <Grid item xs={12} sm={12} md={12}>
                    <Typography className={classes.label}>
                        {activeTimerTomato||activeTimerTomato ? "Tomato task in progress" : "Tomato task to perform"}
                    </Typography>
                </Grid>
                <Paper 
                    elevation={3}
                    className={classes.paper}
                >
                    {activeTimerTomato==true ? 
                        (<FormActive labelTitle = {titleValue} labelDescription = {descriptionValue} />)
                    : activeTimerPause==true ? 
                        (<FormActive labelTitle = {Boolean(lastTomato) ? lastTomato.title : ''} labelDescription = {Boolean(lastTomato) ? lastTomato.description : ''} />)
                    : (
                        <form className={classes.root} noValidate autoComplete="off">
                            <Grid 
                                container 
                                spacing={1}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField 
                                        label="Title" 
                                        variant="outlined" 
                                        value={titleValue} 
                                        fullWidth
                                        placeholder={lastTomato ? `Previous: ${lastTomato.title}` : "Title of the task"} 
                                        onChange={handleTitle}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField 
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rowsMax={4} 
                                        rows={3}
                                        value={descriptionValue} 
                                        label="Description" 
                                        placeholder={lastTomato ? `Previous: ${lastTomato.description}` : "Description of the task"}
                                        onChange={handleDescription} 
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    ) }
                </Paper>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(TomatoForm);