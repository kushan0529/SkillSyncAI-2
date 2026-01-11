// const mongoose = require('mongoose');

const { mongo } = require("mongoose");

// const suggestionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   score: Number,
//   reason: String
// }, { _id: false });

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
//   assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
//   priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
//   requiredSkills: [{ type: String }],  
//   estimatedHours: Number,
//   dueDate: Date,
//   aiSuggestions: [suggestionSchema]
// }, { timestamps: true }); 

// module.exports = mongoose.model('Task', taskSchema);



//version -1
const mongoose=require('mongoose');
const taskSchema = new mongoose.Schema({
  title:{type:String,required:true},
  description:String,
  skills:[{type:String}],
  status:{type:String,enum:['open','assigned','done'],default:'open'},
  assigne:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
},{timestamps:true})

exports.Task=mongoose.model('Task',taskSchema)