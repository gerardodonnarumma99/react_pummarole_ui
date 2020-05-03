import React from "react";
import { Grid } from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class FormActive extends React.Component {
    render() {
        const { labelTitle, labelDescription } = this.props;

        return(
            <Grid 
                container 
                spacing={1}
                alignItems="left"
            >
                <Grid item xs={12} sm={12} md={12}>
                    <ListItem>
                        <ListItemText primary="Title" secondary={labelTitle} />
                    </ListItem>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <ListItem>
                        <ListItemText primary="Description" secondary={labelDescription} />
                    </ListItem>
                </Grid>

            </Grid>
        );
    }
}

export default FormActive;