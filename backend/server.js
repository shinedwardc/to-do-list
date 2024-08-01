const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ReturnDocument } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;

// Connect to MongoDB and set the database reference
const connectDB = async () => {
    try {
        await client.connect();
        db = client.db('Projects'); // Replace with your database name
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

connectDB();

app.get("/tasks", async (req,res,next) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        const collection = db.collection('to-do-list');
        const tasks = await collection.find().toArray();
        if (tasks.length > 0){
            res.send(tasks);
        }
        else{
            res.status(400).json({ message: 'No tasks found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error connecting to database'});
    }   
})

app.post("/task", async (req,res,next) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Cannot connect to database'});
        }
        const collection = db.collection('to-do-list');
        //console.log(req.body.title);
        //console.log(req.body.description);
        console.log(req.body.tags);
        await collection.insertOne({title: req.body.title, description: req.body.description, tags: req.body.tags, createdAt: new Date()});      
    }
    catch (error) {
        res.status(500).json({ message: 'Error connecting to database'});
    }
})

app.put("/tasks/:id", async (req,res,next) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Cannot connect to database' });
        }
        const collection = db.collection("to-do-list");
        const updatedTask = {
            title: req.body.title,
            description: req.body.description
        };
        const id = new ObjectId(req.params.id);
        //console.log(req.body);
        const result = await collection.findOneAndUpdate(
            {_id: id},
            {$set: updatedTask},
            {returnDocument: 'after'}
        )
        //console.log(result);
        if (result.value) {
            res.status(200).json(result.value);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
})

app.delete("/tasks/:id", async (req,res,next) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Cannot connect to database'});
        }
        const collection = db.collection('to-do-list');
        const index = parseInt(req.params.index);
        //console.log(index);
        const allTasks = await collection.find().toArray();
        //console.log(allTasks.length);
        if (index < 0 || index >= allTasks.length){
            return res.status(400).json({ message: 'Invalid index'});
        }
        //console.log(allTasks[0]);
        const id = new ObjectId(req.params.id);
        const deleteResult = await collection.deleteOne({_id: id});
        if (deleteResult.deletedCount === 1){
            res.status(200).json({ message: 'Task deleted successfully'});
        }
        else{
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({message: 'Error connecting to database'});
    }
})


app.listen(port, function() {
    console.log(`Listening on port ${port}`);
})