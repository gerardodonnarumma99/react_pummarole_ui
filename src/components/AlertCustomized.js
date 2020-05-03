import React from "react";
import { Paper } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import EventBus from './../components/EventBus';

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const SHOW_NEXT_TIMER = 'SHOW_NEXT_TIMER';
export const REMOVE_NEXT_TIMER = 'REMOVE_NEXT_TIMER';

class AlertCustomized extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            severity: '',
            message: '',
            hidden: true,
            timer: 0
        }
    }
    
    componentDidMount() {
        window.EventBus.addEventListener(SHOW_MESSAGE, e => this.showLoading(e.detail));

        window.EventBus.addEventListener(SHOW_NEXT_TIMER, e => this.showNextTimer(e.detail));

        window.EventBus.addEventListener(REMOVE_NEXT_TIMER, () => this.removeNextTimer());
    }

    close = () => setTimeout(() => {
        this.setState({ hidden: true });
      }, this.state.timer);

    showLoading = async (e) => {
        const t = e.timer!=null ? e.timer : 3000;
        await this.setState({ severity: e.severity, message: e.message, timer: t, hidden: false });
        this.close();
    }

    showNextTimer = e => {
        this.setState({ severity: e.severity, message: e.message, hidden: false });
    }

    removeNextTimer = () => {
        this.setState({ hidden: true });
        window.EventBus.removeEventListener(SHOW_NEXT_TIMER);
        window.EventBus.removeEventListener(REMOVE_NEXT_TIMER);
    }

    render() {
        const { severity, message, hidden } = this.state;

        return(
            <Paper hidden={hidden}>
                <Alert severity={severity} display="none" > {message} </Alert>
            </Paper>
        );
    }
}

export default AlertCustomized;