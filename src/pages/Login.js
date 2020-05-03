import React from "react";
import { red } from '@material-ui/core/colors';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { Redirect } from "react-router-dom";

class Login extends React.Component{

    render(){
        const { responseLoginGoogle } = this.props;

        if(localStorage.getItem('timetoes_user')) {
            return (<Redirect to="/" />);
        }

        return(
            <React.Fragment>
                <GoogleLogin
                    clientId="95508388897-fratmk837gsqrqv623qsae689g41rdmp.apps.googleusercontent.com"
                    buttonText="Login with Gmail"
                    onSuccess={responseLoginGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    theme={'light'}
                    style={{width: "50%"}}
                />
            </React.Fragment>
        );
    }
}

export default Login;