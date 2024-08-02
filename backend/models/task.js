const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: String,
    tags: [{tag: String, color: String}],
    order: Number,
    createdAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Task',taskSchema,'to-do-list');