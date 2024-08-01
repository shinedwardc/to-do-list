const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get("/", async (req,res,next) => {
    try {
        const tasks = await Task.find();
        //console.log(tasks);
        if (tasks.length > 0){
            res.send(tasks);
        }
        else{
            res.status(400).json({ message: 'No tasks found'});
        }
    } catch (error) {
        console.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({message: 'Error connecting to database'});
    }   
})

router.post("/", async (req,res,next) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        createdAt: new Date()
      });
    try {
        
        //console.log(req.body.title);
        //console.log(req.body.description);
        //console.log(req.body);
        //const result = await collection.insertOne({title: req.body.title, description: req.body.description, tags: req.body.tags, createdAt: new Date()});
        console.log(task); 
        const newTask = await task.save();  
        res.status(201).json(newTask); 
    }
    catch (error) {
        res.status(500).json({ message: 'Error connecting to database'});
    }
})

router.put("/:id", async (req,res,next) => {
    try {
        console.log(req.params.id);
        const task = await Task.findById(req.params.id);
        task.title = req.body.title
        task.description = req.body.description
        task.tags = req.body.tags
        //console.log(req.body);
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
})

router.delete("/:id", async (req,res,next) => {
    try {
        console.log(req.params.id);
        const task = await Task.findByIdAndDelete(req.params.id);
        /*const index = parseInt(req.params.index);
        //console.log(index);
        const allTasks = await collection.find().toArray();
        //console.log(allTasks.length);
        if (index < 0 || index >= allTasks.length){
            return res.status(400).json({ message: 'Invalid index'});
        }*/
        //console.log(allTasks[0]);
        if (!task){
            console.log('not found');
            return res.status(404).json({message: 'Task not found'});
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({message: 'Error connecting to database'});
    }
})

module.exports = router;