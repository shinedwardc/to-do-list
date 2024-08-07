import React, { useEffect, useState } from "react";
import ky from "ky";
import Form from "./Form";
import Task from "./Task";
import Export from "./Export";
import Card from "@mui/material/Card";
import { showSuccessToast } from "../utility/toast";
import { Grid, Button, Checkbox, CircularProgress } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Body = () => {
  const [taskList, updateTaskList] = useState([]);
  const [filteredTaskList, updateFilteredTaskList] = useState([]);
  const [useFilteredTasks, setUseFilteredTasks] = useState(false);
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

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    console.log(filter);
    setSelectedFilter(filter);
    if (filter === "all") {
      setUseFilteredTasks(false);
    } else {
      const filteredTasks = taskList.filter((task) => task.category === filter);
      console.log(filteredTasks);
      setUseFilteredTasks(true);
      updateFilteredTaskList(filteredTasks);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Form onSubmit={addTask} />
        <h2>Current tasks:</h2>
        <div>
          <label htmlFor="sort">Sort by: </label>
          <select
            name="sort"
            id="taskSort"
            value={selectedSort}
            onChange={handleSelectChange}
          >
            <option value=""></option>
            <option value="createdOrder">Created order</option>
            <option value="ascendAlphabet">Ascending alphabetically</option>
            <option value="descendAlphabet">Descending alphabetically</option>
            <option value="category">
              Category (in order of Urgent, Important, Upcoming)
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="sort">Filter by: </label>
          <select
            name="filter"
            id="taskFilter"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All categories</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
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
                                  maxWidth: 500,
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
