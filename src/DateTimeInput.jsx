import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { TextField } from '@mui/material'
import dayjs from 'dayjs'

const DateTimeInput = ({ value, onChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Timestamp"
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
            />
        </LocalizationProvider>
    )
}

export default DateTimeInput
