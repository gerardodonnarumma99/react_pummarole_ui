import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper, withStyles } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import style from "./../components/TableDashboardStyle";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

class TableDashboard extends React.Component {
    render () {
        const { tasks, classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks && tasks.map(item => {
                            return (
                                <TableRow>
                                    <TableCell>{item.type=='tomato' ? item.type=<AccessTimeIcon /> : item.type=<PlayArrowIcon/>}</TableCell>
                                    <TableCell>{item.start_date}</TableCell>
                                    <TableCell>{item.duration}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.status=='done' ? item.status=<div className={classes.completed}><DoneIcon className={classes.icon} fontSize="small"/> Completed</div> : item.status=<div className={classes.broken} ><CloseIcon className={classes.icon} fontSize="small"/> Broken</div>}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default withStyles(style)(TableDashboard);