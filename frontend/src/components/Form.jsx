import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { showWarnToast } from "../utility/toast";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Form.module.css";
import {
  Box,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { MuiColorInput } from "mui-color-input";
import fontControlContrast from "font-color-contrast";
import { DateTime } from "luxon";

const Form = ({ onSubmit, initialValues, isEditing }) => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: null,
    tags: [],
  });

  useEffect(() => {
    if (initialValues) {
      setInputs(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e, value) => {
    if (e && e.target) {
      // Regular input field handling
      const { name, value } = e.target;
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // DatePicker field handling
      const name = e;
      console.log(name);
      const date = value.toJSDate();
      console.log(date);
      setInputs((prev) => ({
        ...prev,
        [name]: date,
      }));
    }
  };

  const [currentTag, updateCurrentTag] = useState("");
  const handleTagChange = (e) => {
    updateCurrentTag(e.target.value);
  };

  const [currentColor, updateCurrentColor] = useState("#90EE90");
  const handleColorChange = (newValue) => {
    updateCurrentColor(newValue);
  };

  const handleTagSubmit = (e) => {
    // e.preventDefault();
    if (currentTag !== "") {
      const newTag = { tag: currentTag, color: currentColor };
      setInputs((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      updateCurrentTag("");
      //updateCurrentColor('');
    }
  };

  const handleTagDelete = (indexToDelete) => {
    setInputs((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputs.title === "" && inputs.description === "") {
      showWarnToast(
        "Please fill in at least one character for both title and description",
      );
      return;
    } else if (inputs.title === "" && inputs.description !== "") {
      showWarnToast("Please fill in title");
      return;
    } else if (inputs.title !== "" && inputs.description === "") {
      showWarnToast("Please fill in description");
      return;
    }
    //alert('Submitted task');
    console.log("inputs: ", inputs);
    onSubmit(inputs);
    setInputs({
      title: "",
      description: "",
      category: "",
      dueDate: null,
      tags: [],
    });
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.questionnare}>
          <div className={styles.titleForm}>
            <Typography sx={{ m: 1 }} variant="h5">
              Title
            </Typography>
            <TextField
              sx={{ width: 230 }}
              type="text"
              name="title"
              size="small"
              variant="outlined"
              onChange={handleChange}
              value={inputs.title}
            />
            <Typography sx={{ m: 1 }} variant="h6">
              Description
            </Typography>
            <TextField
              sx={{ width: 230 }}
              type="text"
              name="description"
              size="small"
              variant="outlined"
              helperText="Describe more of the task in detail"
              onChange={handleChange}
              value={inputs.description}
            />
            <Typography sx={{ m: 1 }} variant="h6">
              Category
            </Typography>
            <FormControl>
              <Select
                sx={{ height: 40, width: 230 }}
                name="category"
                value={inputs.category}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="important">Important</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </Select>
              <FormHelperText sx={{ textAlign: "center" }}>
                Pick a category for the task
              </FormHelperText>
            </FormControl>
            <Typography sx={{ m: 1 }} variant="h6">
              Due date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DatePicker
                name="dueDate"
                selected={inputs.dueDate}
                onChange={(date) => handleChange("dueDate", date)}
              />
            </LocalizationProvider>
          </div>
          <div className={styles.tagForm}>
            <div style={{ paddingBottom: 15 }}>
              <Typography m={1} variant="h6">
                Tags
              </Typography>
              <TextField
                type="text"
                name="tag"
                size="small"
                helperText="Add custom tags with color for the task"
                value={currentTag}
                onChange={handleTagChange}
              />
            </div>
            <div>
              <FormControl sx={{ m: 0 }}>
                <MuiColorInput
                  id="colorInput"
                  name="color"
                  format="hex"
                  value={currentColor}
                  onChange={handleColorChange}
                />
                <FormHelperText sx={{ textAlign: "center" }}>
                  Colorize your tag
                </FormHelperText>
              </FormControl>
            </div>
            <Button
              sx={{ marginTop: 1, marginBottom: 1 }}
              onClick={handleTagSubmit}
              variant="outlined"
            >
              Add tag
            </Button>
            <div>
              {inputs.tags.map((tag, index) => (
                <div
                  key={index}
                  style={{ justifyContent: "center", margin: 5 }}
                >
                  <span
                    style={{
                      color: fontControlContrast(tag.color),
                      backgroundColor: tag.color,
                      borderRadius: 15,
                      padding: 5,
                    }}
                  >
                    {tag.tag}
                  </span>
                  <Button
                    size="small"
                    style={{ marginLeft: 10 }}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    type="button"
                    onClick={() => handleTagDelete(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.button}>
            {isEditing ? (
              <>
                <Button type="submit" variant="contained">
                  Save changes
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
