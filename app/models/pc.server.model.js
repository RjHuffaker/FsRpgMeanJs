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

var DiceSchema = new Schema(Dice);

/**
 * Ability Schema
 */
var AbilitySchema = new Schema({
	name: {
		type: String,
		default: ''
	},
	order: {
		type: Number,
		default: 0
	},
	dice: Dice
});

/**
 * Pc Schema
 */
var PcSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	cards:[
	
	]
});

mongoose.model('Pc', PcSchema);