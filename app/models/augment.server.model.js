'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Augment Schema
 */
var AugmentSchema = new Schema({
	name: {
		type: String,
		default: 'Augment',
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
		default: 'augment'
	},
	cardNumber: {
		type: Number,
		default: 0
	}
});

mongoose.model('Augment', AugmentSchema);