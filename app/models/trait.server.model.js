'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Action = require('./action.server.model'),
	Schema = mongoose.Schema;

/**
 * Card Schema
 */
var TraitSchema = new Schema({
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
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	deck: {
		type: Schema.ObjectId,
		ref: 'Deck'
	},
	cardType: {
		type: String
	},
	cardNumber: {
		type: Number,
		default: 1
	},
	cardSet: {
		type: Number,
		default: 1
	},
	aspect: {
		type: Schema.Types.ObjectId,
		ref: 'Aspect'
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
	actions: [
		Action
	]
});

mongoose.model('Trait', TraitSchema);