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
var CardSchema = new Schema({
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
	actions: [
		Action
	],
	item: {
		itemType: {
			type: String
		},
		itemSlot: {
			type: String
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
		weight:	{
			type: Number,
			default: 0
		},
		cost:	{
			type: Number,
			default: 0
		}
	},
	origin: {
		archetype: {
			type: String
		},
		allegiance: {
			type: String
		},
		race: {
			type: String
		},
		size: {
			type: String,
			default: 'medium'
		},
		rank: {
			type: Number,
			default: 0
		},
		speed: {
			type: Number
		},
		durability: {
			type: Number
		},
		health: {
			type: Number
		},
		stamina: {
			type: Number
		},
		injury: {
			type: Number
		},
		fatigue: {
			type: Number
		}
	}
});

mongoose.model('Card', CardSchema);