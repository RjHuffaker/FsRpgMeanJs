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
	locked: {
		type: Boolean,
		default: false
	},
	cardType: {
		type: String,
		default: 'trait'
	},
	cardNumber: {
		type: Number,
		default: 0
	}
});

mongoose.model('Trait', TraitSchema);