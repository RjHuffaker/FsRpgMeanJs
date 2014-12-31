'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Dice = {
	name: {
		type: String,
		default: 'd__'
	},
	image: {
		type: String,
		default: 'modules/core/img/d___.png'
	},
	sides: {
		type: Number,
		default: 0
	},
	order: {
		type: Number,
		default: 0
	}
};

module.exports = Dice;