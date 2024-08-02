import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import styles from "../styles/Form.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
//import { SketchPicker } from 'react-color';

const Form = ({ onSubmit, initialValues }) => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
  });

  useEffect(() => {
    if (initialValues) {
      setInputs(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [currentTag, updateCurrentTag] = useState("");
  const handleTagChange = (e) => {
    updateCurrentTag(e.target.value);
  };

  const [currentColor, updateCurrentColor] = useState("#90EE90");
  const handleColorChange = (e) => {
    updateCurrentColor(e.target.value);
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
    if (inputs.title === "" || inputs.description === "") {
      alert(
        "Please fill in at least one character for both title and description",
      );
      return;
    }
    //alert('Submitted task');
    onSubmit(inputs);
    setInputs({ title: "", description: "", category: "", tags: [] });
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.questionnare}>
          <div className={styles.titleForm}>
            <h4>Title: </h4>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={inputs.title}
            />
            <h4>Description: describe more of the task you need to do</h4>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={inputs.description}
            />
            <h4>Select a category: </h4>
            <select name = "category" onChange = {handleChange}>
              <option value = ""></option>
              <option value = "urgent">Urgent</option>
              <option value = "important">Important</option>
              <option value = "upcoming">Upcoming</option>
            </select>
          </div>
          <div className={styles.tagForm}>
            <div style={{ paddingBottom: 10 }}>
              <h5>Tag (add a list of tags for the task): </h5>
              <input
                type="text"
                name="tag"
                value={currentTag}
                onChange={handleTagChange}
              />
            </div>
            <div>
              <input
                type="color"
                id="colorInput"
                name="color"
                value={currentColor.toString()}
                onChange={handleColorChange}
              />
              <label for="colorInput"> Choose a color for the tag</label>
            </div>
            <Button onClick={handleTagSubmit} type="button">
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
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
