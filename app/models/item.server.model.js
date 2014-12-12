'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
	name: {
		type: String,
		default: 'Item',
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
		default: 'item'
	},
	cardNumber: {
		type: Number,
		default: 0
	}
});

mongoose.model('Item', ItemSchema);