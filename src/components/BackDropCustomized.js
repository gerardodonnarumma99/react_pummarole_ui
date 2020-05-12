import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import EventBus from './EventBus';
import style from './BackDropCustomizedStyle'

export const LOAD = "LOAD";
export const REMOVE_LOAD = "REMOVE_LOAD";

class BackDropCustomized extends React.Component { 
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    componentDidMount() {
        
        window.EventBus.addEventListener(LOAD, e => this.showLoader());
        window.EventBus.addEventListener(REMOVE_LOAD, e => this.removeLoader());
    }

    showLoader = () => {
        this.setState({ open: true });
    }

    removeLoader = () => {
        this.setState({ open: false });
        window.EventBus.removeEventListener(LOAD);
        window.EventBus.removeEventListener(REMOVE_LOAD);
    }

    render() {

        const { classes } = this.props;

        return(
            <div>
                <Backdrop className={classes.backdrop} open={this.state.open} >
                    <CircularProgress color="primary" />
                </Backdrop>
            </div>
        );
    }
}

export default withStyles(style)(BackDropCustomized);