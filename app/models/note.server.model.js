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
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	deck: {
		type: Schema.ObjectId,
		ref: 'Deck'
	},
	deckSize: {
		type: Number
	},
	deckName: {
		type: String
	},
	cardType: {
		type: String
	},
	cardNumber: {
		type: Number
	},
	content: {
		type: String
	}
});

mongoose.model('Note', NoteSchema);