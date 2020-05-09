import React from 'react';
import { IconButton, Popover, Grid, ListItem, ListItemText } from "@material-ui/core";
import { withRouter } from 'react-router';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

class UserInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null
        }
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    logout = () => {
        try{
            if( typeof( window.gapi.auth2.getAuthInstance() ) != 'undefined' ) {
                window.gapi.auth2.getAuthInstance().disconnect();
            } 
        } catch(err) {}
        finally {
            localStorage.removeItem('timetoes_user');
            this.props.history.push('/login');
        }
    }

    render() {
        const { profil } = this.props;

        const open = Boolean(this.state.anchorEl);

        const id = open ? 'simple-popover' : undefined;

        return(
            <React.Fragment>
                <IconButton color="primary" aria-label="User profil" component="span" onClick={this.handleClick}>
                    <img src={profil.imageUrl} style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%"
                    }}/>
                </IconButton>

                <Popover
                    id={id}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                    style={
                        {
                            height: "300px"
                        }
                    }
                >
                    <Grid 
                        container 
                        spacing={1}
                        justify="center"
                        alignItems="center"
                        direction="column"
                        spacing={1}
                    >
                        <Grid item xs={12} sm={12} md={12}>
                            <ListItem>
                                <ListItemText primary={profil.givenName+" "+profil.familyName} secondary={profil.email} />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <IconButton color="primary" aria-label="User profil" component="span" onClick={this.logout} >
                                Logout <ExitToAppIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Popover>
            </React.Fragment>
        );
    }
}

export default withRouter(UserInfo);