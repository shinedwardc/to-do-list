import React, { useEffect, useState } from "react";
import ky from "ky";
import Form from "./Form";
import Task from "./Task";
import Export from "./Export";
import { showSuccessToast } from "../utility/toast";
import {
  Box,
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Body = () => {
  const [taskList, updateTaskList] = useState([]);
  const [filteredTaskList, updateFilteredTaskList] = useState([]);
  const [useFilteredTasks, setUseFilteredTasks] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedTasks, updateCheckedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      let tasks = await ky.get("http://localhost:3000/tasks").json();
      tasks.sort((a, b) => {
        return a.order - b.order;
      });
      if (Array.isArray(tasks)) {
        updateTaskList(tasks);
        updateFilteredTaskList(tasks);
      } else {
        updateTaskList([]);
      }
    } catch (error) {
      console.error("error loading tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (editingTaskIndex == null) {
      fetchTasks();
    }
  }, [editingTaskIndex]);

  useEffect(() => {
    filterTasks();
  }, [selectedFilter, search]);

  const addTask = async (formData) => {
    formData.order = taskList.length;
    console.log("formData: ", formData);
    //console.log(formData.tag.json());

    try {
      //console.log(formData);
      const response = await ky
        .post(`http://localhost:3000/tasks`, {
          json: formData,
        })
        .json();
      console.log(response);
      updateTaskList((prev) => [...prev, response]);
      showSuccessToast("Successfully submitted task!");
      console.log("Task added successfully");
    } catch (error) {
      console.error("Could not post task");
    }
  };

  const editTask = async (updatedTask) => {
    try {
      const response = await ky
        .put(`http://localhost:3000/tasks/${taskList[editingTaskIndex]._id}`, {
          json: updatedTask,
        })
        .json();
      updateTaskList((prev) => {
        const newList = prev.map((task, index) =>
          index === editingTaskIndex ? response : task,
        );
        console.log("New Task List:", newList);
        return newList;
      });
      showSuccessToast("Successfully edited task!");
    } catch (error) {
      console.error("Could not call put");
    } finally {
      setEditingTaskIndex(null);
      console.log(editingTaskIndex);
    }
  };

  const deleteTask = async (indexToDelete) => {
    try {
      const taskToDelete = taskList[indexToDelete];
      await ky.delete(`http://localhost:3000/tasks/${taskToDelete._id}`).json();
      updateTaskList(taskList.filter((_, index) => index !== indexToDelete));
      console.log("Task erased successfully");
      showSuccessToast("Task deleted successfully!");
    } catch (error) {
      console.error("Delete task error");
    }
  };

  const handleCheckBoxChange = (checkedIndex) => {
    updateCheckedTasks((prev) => {
      if (prev.includes(checkedIndex)) {
        return checkedTasks.filter((index) => index !== checkedIndex);
      } else {
        return [...prev, checkedIndex];
      }
    });
  };

  const handleDragEnd = async (result) => {
    console.log(result);
    if (!result.destination) return;
    //console.log(selectedSort);
    //console.log('source index ',result.source.index);
    //console.log('destination index ', result.destination.index);
    if (result.source.index !== result.destination.index) {
      const items = Array.from(taskList);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      updateTaskList(items);
      setSelectedSort("");
      try {
        const response = await ky
          .post(`http://localhost:3000/tasks/order`, {
            json: { order: items.map((task) => task._id) },
          })
          .json();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelectChange = (e) => {
    setSelectedSort(e.target.value);
    //console.log(e.target.value);
    const items = Array.from(taskList);
    //console.log(items);
    switch (e.target.value) {
      case "default":
        items.sort((a, b) => {
          return a.order - b.order;
        });
        break;
      case "createdOrder":
        //console.log(new Date(items[0].createdAt).getTime());
        //console.log(new Date(items[1].createdAt).getTime());
        items.sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return aTime - bTime;
        });
        updateTaskList(items);
        break;
      case "ascendAlphabet":
        items.sort((a, b) => {
          return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
        });
        updateTaskList(items);
        break;
      case "descendAlphabet":
        items.sort((a, b) => {
          return a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1;
        });
        updateTaskList(items);
        break;
      case "category":
        const categoryOrder = {
          urgent: 1,
          important: 2,
          upcoming: 3,
        };
        items.sort((a, b) => {
          const aCategory = categoryOrder[a.category];
          const bCategory = categoryOrder[b.category];
          return aCategory - bCategory;
        });
        updateTaskList(items);
        break;
    }
  };

  const filterTasks = () => {
    let filtered = taskList;
    if (selectedFilter === "all" && search === "") {
      setUseFilteredTasks(false);
    } else {
      if (selectedFilter !== "all") {
        setUseFilteredTasks(true);
        filtered = filtered.filter((task) => task.category === selectedFilter);
      }
      if (search !== "") {
        setUseFilteredTasks(true);
        const lowerCaseSearch = search.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(lowerCaseSearch) ||
            task.description.toLowerCase().includes(lowerCaseSearch),
        );
      }
      updateFilteredTaskList(filtered);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Form onSubmit={addTask} isEditing={false} />
        <Typography variant="h5">Current tasks: </Typography>
        <Box>
          <FormControl size="small" sx={{ m: 1, width: 250 }}>
            <InputLabel htmlFor="sort">Sort by</InputLabel>
            <Select
              name="sort"
              id="taskSort"
              label="Sort by"
              value={selectedSort}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Default</em>
              </MenuItem>
              <MenuItem value="createdOrder">Created order</MenuItem>
              <MenuItem value="ascendAlphabet">
                Ascending alphabetically
              </MenuItem>
              <MenuItem value="descendAlphabet">
                Descending alphabetically
              </MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
            <FormHelperText sx={{ textAlign: "center" }}>
              Sort the order of tasks below
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ mb: 1, justifyContent: "space-evenly" }}>
          <FormControl sx={{ mr: 1, width: 250 }} size="small">
            <InputLabel htmlFor="sort">Filter by</InputLabel>
            <Select
              name="filter"
              id="taskFilter"
              label="Filter by"
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All categories</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="important">Important</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
            </Select>
            <FormHelperText sx={{ textAlign: "center" }}>
              Filter tasks based on category
            </FormHelperText>
          </FormControl>
          <TextField
            sx={{ ml: 1, width: 250 }}
            label="Search"
            name="search"
            helperText="Search tasks with text input"
            FormHelperTextProps={{
              sx: {
                textAlign: "center",
              },
            }}
            value={search}
            onChange={handleSearch}
            size="small"
          />
        </Box>
        {(useFilteredTasks ? filteredTaskList : taskList).length > 0 ? (
          <>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    sx={{
                      border: "1px solid red",
                      maxWidth: 1000,
                      margin: "0 auto",
                      backgroundColor: "lightblue",
                    }}
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {!isLoading ? (
                      (useFilteredTasks ? filteredTaskList : taskList).map(
                        (task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                variant="outlined"
                                direction="column"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  width: 625,
                                  marginTop: 1,
                                  marginBottom: 1,
                                  opacity: checkedTasks?.includes(index)
                                    ? 0.5
                                    : 1,
                                  ":hover": {
                                    boxShadow: 20,
                                  },
                                }}
                              >
                                {index === editingTaskIndex ? (
                                  <>
                                    <Form
                                      onSubmit={(task) => editTask(task)}
                                      initialValues={task}
                                      isEditing={true}
                                      key={index}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Task task={task} />
                                    <Checkbox
                                      onChange={() =>
                                        handleCheckBoxChange(index)
                                      }
                                    />
                                    <Button
                                      variant="outlined"
                                      onClick={() => setEditingTaskIndex(index)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => deleteTask(index)}
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </Card>
                            )}
                          </Draggable>
                        ),
                      )
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                        }}
                      >
                        <CircularProgress />
                      </div>
                    )}
                    {provided.placeholder}
                  </Grid>
                </div>
              )}
            </Droppable>
            <Export taskList={taskList} />
          </>
        ) : useFilteredTasks ? (
          <div>
            <p>Currently no active tasks with filter</p>
          </div>
        ) : (
          <div>
            <p>Currently no active tasks</p>
          </div>
        )}
      </DragDropContext>
    </>
  );
};

export default Body;
