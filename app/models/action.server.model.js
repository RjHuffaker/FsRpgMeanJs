'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Action Schema
 */

var ActionSchema = new Schema({
	show: {
		type: Boolean,
		default: false
	},
	name: {
		type: String
	},
	usage: {
		type: String
	},
	targetType: {
		type: String
	},
	targetDetail: {
		type: String
	},
	frequency: {
		type: String
	},
	reflexive: {
		type: Boolean,
		default: false
	},
	thrown: {
		type: Boolean,
		default: false
	},
	effect: {
		show: {
			type: Boolean,
			default: false
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
	},
	attack: {
		show: {
			type: Boolean,
			default: false
		},
		attackType: {
			type: String
		},
		dice_a: {
			type: String
		},
		dice_b: {
			type: String
		},
		versus: {
			type: String
		},
		success: {
			show: {
				type: Boolean,
				default: true
			},
			content: {
				type: String
			}
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
	defense: {
		defenseType: {
			type: String
		},
		dice_a: {
			type: String
		},
		dice_b: {
			type: String
		},
		success: {
			show: {
				type: Boolean,
				default: false
			},
			content: {
				type: String
			}
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
	}
});

module.exports = ActionSchema;
