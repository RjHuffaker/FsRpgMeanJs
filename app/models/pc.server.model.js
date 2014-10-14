'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pc Schema
 */
var PcSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	sex: {
		type: String,
		default: '',
		trim: true
	},
	race: {
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
	}
});

mongoose.model('Pc', PcSchema);