import React from "react";
import { Button } from '@mui/material';
import { CSVLink } from "react-csv";

const Export = ({taskList}) => {
    return (
        <Button><CSVLink data = {taskList}>Click here to download a CSV file containing tasks</CSVLink></Button>
    )
}

export default Export