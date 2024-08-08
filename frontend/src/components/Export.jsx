import React from "react";
import { Box, Button } from "@mui/material";
import { CSVLink } from "react-csv";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Export = ({ taskList }) => {
  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Button variant="contained" startIcon={<CloudUploadIcon />}>
        <CSVLink
          style={{ textDecoration: "none", color: "white" }}
          filename="taskList.csv"
          data={taskList}
        >
          Click here to download a CSV file containing tasks
        </CSVLink>
      </Button>
    </Box>
  );
};

export default Export;
