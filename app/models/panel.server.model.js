'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * panel Schema
 */

var PanelSchema = {
	panelType: {
		type: String
	},
	aspectData: {
		type: Schema.Types.ObjectId,
		ref: 'Aspect'
	},
	traitData: {
		type: Schema.Types.ObjectId,
		ref: 'Trait'
	},
	featData: {
		type: Schema.Types.ObjectId,
		ref: 'Feat'
	},
	augmentData: {
		type: Schema.Types.ObjectId,
		ref: 'Augment'
	},
	itemData: {
		type: Schema.Types.ObjectId,
		ref: 'Item'
	},
	originData: {
		type: Schema.Types.ObjectId,
		ref: 'Origin'
	},
	noteData: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	},
	x_coord: {
		type: Number
	},
	y_coord: {
		type: Number
	},
	z_coord: {
		type: Number
	},
	x_dim: {
		type: Number,
		default: 15
	},
	y_dim: {
		type: Number,
		default: 21
	},
	above: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
	},
	below: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
	},
	left: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
	},
	right: {
		adjacent: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
		overlap: {
			type: Schema.Types.ObjectId,
			ref: 'Panel',
			default: null
		},
	},
	dragging: {
		type: Boolean,
		default: false
	},
	locked: {
		type: Boolean,
		default: false
	},
	level: {
		type: Number
	}
};

module.exports = PanelSchema;
