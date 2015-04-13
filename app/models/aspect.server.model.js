'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Action = require('./action.server.model'),
	Property = require('./property.server.model'),
	Schema = mongoose.Schema;

/**
 * Aspect Schema
 */
var AspectSchema = new Schema({
	name: {
		type: String,
		default: '',
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
	deck: {
		type: Schema.ObjectId,
		ref: 'Deck'
	},
	cardType: {
		type: String
	},
	cardNumber: {
		type: Number,
		default: 1
	},
	cardSet: {
		type: Number,
		default: 1
	},
	aspectType: {
		type: String
	},
	alignedTerrain: {
		type: String
	},
	opposedTerrain: {
		type: String
	},
	size: {
		type: String
	},
	speed: {
		type: Number
	},
	properties: [
		Property
	],
	actions: [
		Action
	]
});

mongoose.model('Aspect', AspectSchema);