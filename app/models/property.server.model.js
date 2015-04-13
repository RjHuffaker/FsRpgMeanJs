'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Action Schema
 */

var PropertySchema = new Schema({
	show: {
		type: Boolean,
		default: false
	},
	name: {
		type: String
	},
	content: {
		type: String
	},
	list: {
		listType: {
			type: String,
			default: 'none'
		},
		items: []
	}
});

module.exports = PropertySchema;
