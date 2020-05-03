import React from "react";
import { red } from '@material-ui/core/colors';
import GoogleLogout from 'react-google-login';
import { Redirect } from "react-router-dom";

class Logout extends React.Component{

    render(){
        const { logout } = this.props;

        if(!localStorage.getItem('is_logged_in')) {
            return (<Redirect to="/login" />);
        }

        return(
            {logout}
        );
    }
}

export default Logout;