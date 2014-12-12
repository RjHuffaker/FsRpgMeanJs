'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Feat Schema
 */
var FeatSchema = new Schema({
	name: {
		type: String,
		default: 'Feat',
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
		default: 'feat'
	},
	cardNumber: {
		type: Number,
		default: 0
	}
});

mongoose.model('Feat', FeatSchema);