'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
	}
	
	
});

mongoose.model('Aspect', AspectSchema);