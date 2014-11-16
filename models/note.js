'use strict';
var mongoose = require('mongoose');
// we use mongoose to simplify setting up mongo schemas

// define a new noteSchema
var noteSchema = mongoose.Schema({
    noteBody: 'String'
});

// this module exports the mongoose model('Note', noteSchema)
module.exports = mongoose.model('Note', noteSchema);
