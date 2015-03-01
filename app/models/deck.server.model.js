'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Deck Schema
 */
var DeckSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: ''
	},
	deckType: {
		type: String
	},
	cardList: [
		{
			type: Schema.ObjectId,
			ref: 'Card'
		}
	]
});




mongoose.model('Deck', DeckSchema);