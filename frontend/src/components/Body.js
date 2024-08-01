import React, {useEffect, useState} from 'react';
import ky from 'ky';
import Form from './Form';
import Task from './Task';
import Export from './Export';
import Card from '@mui/material/Card';
import { Grid, Button, Checkbox, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const Body = () => {

    const [taskList,updateTaskList] = useState([]);
    const [checkedTasks, updateCheckedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTaskIndex, setEditingTaskIndex] = useState(null);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const tasks = await ky.get('http://localhost:3000/tasks').json();
            if (Array.isArray(tasks)){
                updateTaskList(tasks);
            }
            else{
                updateTaskList([]);
            }
        } catch (error) {
            console.error('error loading tasks');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    },[])

    useEffect(() => {
        if (editingTaskIndex == null){
            fetchTasks();
        }
    },[editingTaskIndex]);

    const addTask = async (formData) => {
        console.log('formData: ', formData);
        //console.log(formData.tag.json());
        updateTaskList([...taskList, formData]);
        try {
            //console.log(formData);
            const response = await ky.post(`http://localhost:3000/task`, {
                json: formData
            }).json();
            console.log(response);
        } catch (error) {
            console.error('Could not post task');
        } 
    }

    const editTask = async (updatedTask) => {
        try {
            const response = await ky.put(`http://localhost:3000/tasks/${taskList[editingTaskIndex]._id}`, {
                json: updatedTask
            }).json();
            updateTaskList((prev) => {
                const newList = prev.map((task, index) => index === editingTaskIndex ? response : task);
                console.log('New Task List:', newList);
                return newList;
            }); 
        } catch (error) {
            console.error('Could not call put');
        }
        setEditingTaskIndex(null);
        console.log(editingTaskIndex);
    }

    const deleteTask = async (indexToDelete) => {
        try {
            const taskToDelete = taskList[indexToDelete];
            await ky.delete(`http://localhost:3000/tasks/${taskToDelete._id}`).json();
            updateTaskList(taskList.filter((_,index) => index !== indexToDelete))
            console.log('Task erased successfully');
        } catch (error) {
            console.error('Delete task error');
        }
        
        
    }

    const handleCheckBoxChange = (checkedIndex) => {
        updateCheckedTasks(prev => {
            if (prev.includes(checkedIndex)){
                return checkedTasks.filter((index) => index !== checkedIndex);
            }
            else{
                return [...prev, checkedIndex];
            }
        })

    }

    const handleDragEnd = (result) => {
        console.log(result);
        if (!result.destination) return;

        const items = Array.from(taskList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateTaskList(items);
    };

    return (
        <>
        <DragDropContext onDragEnd={handleDragEnd}>
            <Form onSubmit = {addTask} />
            <h2>Current tasks:</h2>
            {taskList.length > 0 ? 
                    (<>
                    <Droppable droppableId = "tasks">
                        {(provided) => 
                        (   <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Grid sx = {{border: '1px solid red', maxWidth: 1000, margin: '0 auto'}} container direction = "column" justifyContent = "space-between" alignItems = "center">
                                {!isLoading ?
                                taskList.map((task,index) => (
                                    <Draggable key = {task._id.toString()} draggableId={task._id.toString()} index = {index}>
                                        {(provided) => (
                                            <Card variant = "outlined"
                                            direction = "column" 
                                            ref = {provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx = {{
                                                maxWidth: 500, 
                                                marginTop: 1,
                                                marginBottom: 1, 
                                                opacity: checkedTasks?.includes(index) ? 0.5 : 1,
                                                ':hover': {
                                                    boxShadow: 20
                                                },
                                                    }}>
                                            {index === editingTaskIndex ? 
                                            (
                                            <>
                                                <Form onSubmit = {(task) => editTask(task)} initialValues = {task} key = {index} />
                                            </>
                                            ) : (
                                            <>
                                                <Task task = {task}/>
                                                <Checkbox onChange = {() => handleCheckBoxChange(index)}/>
                                                <Button variant = "outlined" onClick = {() => setEditingTaskIndex(index)}>Edit</Button>
                                                <Button variant = "outlined" color = "error" onClick = {() => deleteTask(index)}>Delete</Button>
                                            </>
                                            )}
                                                    
                                        </Card>
                                        )}
                                    </Draggable>
                                )) : 
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                    <CircularProgress />
                                </div>            
                                }
                                {provided.placeholder}
                            </Grid>
                        </div>
                        )}

                </Droppable>
                <Export taskList = {taskList}/>
                </>
                ) : (
                    <div>
                        <p>Currently no active tasks</p>
                    </div>
                )
            }

        </DragDropContext>
        </>
    )
}

export default Body;