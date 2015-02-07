'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Origin Schema
 */
var OriginSchema = new Schema({
	name: {
		type: String,
		default: 'Origin',
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
		default: 'origin'
	},
	cardNumber: {
		type: Number,
		default: 0
	},
	archetype: {
		type: String
	},
	allegiance: {
		type: String
	},
	race: {
		type: String
	},
	size: {
		type: String,
		default: 'medium'
	},
	rank: {
		type: Number,
		default: 0
	},
	speed: {
		type: Number
	},
	durability: {
		type: Number
	},
	health: {
		type: Number
	},
	stamina: {
		type: Number
	},
	injury: {
		type: Number
	},
	fatigue: {
		type: Number
	}
});

mongoose.model('Origin', OriginSchema);