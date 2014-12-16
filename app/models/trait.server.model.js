'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trait Schema
 */
var TraitSchema = new Schema({
	name: {
		type: String,
		default: 'Trait',
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
		default: 'trait'
	},
	cardNumber: {
		type: Number,
		default: 0
	},
	fontSize: {
		type: Number,
		default: 10
	},
	description: {
		type: String,
		default: ''
	}
});

mongoose.model('Trait', TraitSchema);