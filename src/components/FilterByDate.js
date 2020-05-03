import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class FilterByDate extends React.Component {

    change = (date) => {
        console.log("Data",date);
    }
    render() {
        const { handleDateChange, date } = this.props;

        return(
            <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Filter by date"
                    format="dd/MM/yyyy"
                    value={ date }
                    onChange={ handleDateChange }
                    disableFuture
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        );
    }
}

export default FilterByDate;