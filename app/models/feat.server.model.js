'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Action = require('./action.server.model'),
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
	deckType: {
		type: String
	},
	cardType: {
		type: String,
		default: 'feat'
	},
	cardNumber: {
		type: Number,
		default: 0
	},
	keyword: {
		type: String
	},
	prerequisite: {
		type: String
	},
	description: {
		show: {
			type: Boolean,
			default: false
		},
		content: {
			type: String
		}
	},
	benefit: {
		show: {
			type: Boolean,
			default: false
		},
		content: {
			type: String
		},
		criticalSuccess: {
			show: {
				type: Boolean,
				default: false
			},
			content: {
				type: String
			}
		}
	},
	actions: [Action]
});

mongoose.model('Feat', FeatSchema);