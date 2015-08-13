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
	],
	x_coord: {
		type: Number
	},
	y_coord: {
		type: Number
	},
	z_coord: {
		type: Number
	},
	x_dim: {
		type: Number,
		default: 15
	},
	y_dim: {
		type: Number,
		default: 21
	},
	above: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
	},
	below: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
	},
	left: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
	},
	right: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel'
		},
	},
	dragging: {
		type: Boolean,
		default: false
	},
	locked: {
		type: Boolean,
		default: false
	}
});

DeckSchema.methods.logStuff = function logStuff(){
	console.log('Logged Stuff!');
};

//DeckSchema.set('versionKey', false);

mongoose.model('Deck', DeckSchema);