import React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Task = ({ task }) => {
  const date = new Date(task.createdAt);

  return (
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {task.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {task.description}
      </Typography>
      <Typography>{"Task created at " + date.toDateString()}</Typography>
      <div>
        {task.tags &&
          task.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                marginRight: 8,
                backgroundColor: tag.color,
                borderRadius: 15,
                padding: 5,
              }}
            >
              {tag.tag}
            </span>
          ))}
      </div>
    </CardContent>
  );
};

export default Task;
