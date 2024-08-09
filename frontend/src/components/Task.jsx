import React from "react";
import { CardContent, Typography, Stack, Chip } from "@mui/material";
import fontControlContrast from "font-color-contrast";
import { DateTime } from "luxon";

const Task = ({ task }) => {
  //console.log(typeof(task.createdDate))
  const dueDate = DateTime.fromJSDate(new Date(task.dueDate));
  //const createdDate = DateTime.fromJSDate(new Date(task.createdDate));

  return (
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {task.title}
      </Typography>
      <Typography variant="body2">{task.description}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {task.category}
      </Typography>
      <Typography>{"Due date " + dueDate.toLocaleString()}</Typography>
      <Stack
        sx={{ marginBottom: -1 }}
        direction="row"
        spacing={1}
        justifyContent="center"
      >
        {task.tags.length > 0 &&
          task.tags.map((tag, index) => (
            <Chip
              key={index}
              sx={{
                m: 1,
                padding: 1,
                color: fontControlContrast(tag.color),
                backgroundColor: tag.color,
              }}
              label={tag.tag}
              variant="outlined"
            />
          ))}
      </Stack>
    </CardContent>
  );
};

export default Task;
