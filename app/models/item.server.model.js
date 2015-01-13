'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Action = require('./action.server.model'),
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
	deckType: {
		type: String
	},
	cardType: {
		type: String,
		default: 'item'
	},
	cardNumber: {
		type: Number,
		default: 0
	},
	itemType: {
		type: String
	},
	itemSlot: {
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
	durability: {
		show: {
			type: Boolean,
			default: false
		},
		modifier: {
			type: Number,
			default: 0
		}
	},
	speed: {
		show: {
			type: Boolean,
			default: false
		},
		modifier: {
			type: Number,
			default: 0
		}
	},
	finesse: {
		show: {
			type: Boolean,
			default: false
		},
		modifier: {
			type: Number,
			default: 0
		}
	},
	actions: [
		Action
	],
	weight:	{
		type: Number,
		default: 0
	},
	cost:	{
		type: Number,
		default: 0
	}
});

mongoose.model('Item', ItemSchema);