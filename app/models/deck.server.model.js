'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Panel = {
	data: {
		type: Schema.Types.ObjectId,
		ref: 'Card'
	},
	cardRole: {
		type: String,
		default: 'featureCard'
	},
	cardNumber: {
		type: Number
	},
	cardSet: {
		type: Number
	},
	x_coord: {
		type: Number
	},
	y_coord: {
		type: Number
	},
	x_overlap: {
		type: Boolean,
		default: false
	},
	y_overlap: {
		type: Boolean,
		default: false
	},
	dragging: {
		type: Boolean,
		default: false
	},
	stacked: {
		type: Boolean,
		default: false
	},
	locked: {
		type: Boolean,
		default: false
	}
};
	
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
	cardRole: {
		type: String,
		default: 'deckSummary'
	},
	deckType: {
		type: String
	},
	deckSize: {
		type: Number,
		default: '4'
	},
	cardList: [
		Panel
	]
});

mongoose.model('Deck', DeckSchema);