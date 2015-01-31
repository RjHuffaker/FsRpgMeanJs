'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Note name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	cardType: {
		type: String,
		default: 'item'
	},
	cardNumber: {
		type: Number,
		default: 0
	},
	content: {
		type: String
	}
});

mongoose.model('Note', NoteSchema);