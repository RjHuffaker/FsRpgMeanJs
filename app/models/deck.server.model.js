'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Panel = require('./panel.server.model'),
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
	panelType: {
		type: String,
		default: 'deckSummary'
	},
	x_coord: {
		type: Number,
		default: 0
	},
	y_coord: {
		type: Number,
		default: 0
	},
	dependencies: [
		{
			type: Schema.ObjectId,
			ref: 'Deck'
		}
	],
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

DeckSchema.set('versionKey', false);

mongoose.model('Deck', DeckSchema);
