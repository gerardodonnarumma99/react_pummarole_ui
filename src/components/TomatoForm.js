import React from "react";
import { Paper, TextField, Grid, withStyles } from "@material-ui/core";
import style from "./TomatoFormStyle";

class TomatoForm extends React.Component {

    render () {
        const { hiddenForm, inProgress, titleValue, descriptionValue, lastTitle, lastDescription, handleTitle, handleDescription, classes } = this.props;
        
        return (
            <Paper 
                elevation={3} 
                className={classes.paper}
            >

                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container direction="col" justify="center" alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label="Title" value={titleValue} placeholder={lastTitle==null ? "Title of the task" : "Previous: "+lastTitle} onChange={handleTitle}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField variant="outlined" className={classes.description} multiline rowsMax={4} value={descriptionValue} label="Description" placeholder={lastDescription==null ? "Description of the task" : "Previous: "+lastDescription} onChange={handleDescription}/>
                        </Grid>
                    </Grid>
                </form>
                
            </Paper>
        );
    }
}

export default withStyles(style)(TomatoForm);