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
	cards:{
		pc1: {
			index: {
				type: Number,
				default: 0
			},
			cardType: {
				type: String,
				default: 'pc1'
			},
			column: {
				type: Number,
				default: 0
			},
			overlap: {
				type: Boolean,
				default: false
			},
			name: {
				type: String,
				default: ''
			},
			sex: {
				type: String,
				default: '---'
			},
			race: {
				type: String,
				default: 'Weolda'
			},
			abilities: [ AbilitySchema ],
			
			dicepool: [ DiceSchema ]
		},
		pc2: {
			index: {
				type: Number,
				default: 1
			},
			cardType: {
				type: String,
				default: 'pc2'
			},
			column: {
				type: Number,
				default: 250
			},
			overlap: {
				type: Boolean,
				default: false
			},
			experience: {
				type: Number,
				default: 0
			}
		},
		pc3: {
			index: {
				type: Number,
				default: 2
			},
			cardType: {
				type: String,
				default: 'pc3'
			},
			column: {
				type: Number,
				default: 500
			},
			overlap: {
				type: Boolean,
				default: false
			}
		}
	}
});

mongoose.model('Pc', PcSchema);