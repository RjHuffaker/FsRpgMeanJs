'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Panel = {
	cardRole: {
		type: String
	},
	traitData: {
		type: Schema.Types.ObjectId,
		ref: 'Trait'
	},
	featData: {
		type: Schema.Types.ObjectId,
		ref: 'Feat'
	},
	augmentData: {
		type: Schema.Types.ObjectId,
		ref: 'Augment'
	},
	itemData: {
		type: Schema.Types.ObjectId,
		ref: 'Item'
	},
	originData: {
		type: Schema.Types.ObjectId,
		ref: 'Origin'
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
	],
	x_coord: {
		type: Number,
		default: 0
	},
	y_coord: {
		type: Number,
		default: 0
	}
});

DeckSchema.set('versionKey', false);

mongoose.model('Deck', DeckSchema);