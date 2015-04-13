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
	cardRole: {
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
	x_coord: {
		type: Number
	},
	y_coord: {
		type: Number
	},
	x_overlap: {
		type: Boolean,
		default: false
	},
	y_overlap: {
		type: Boolean,
		default: false
	},
	dragging: {
		type: Boolean,
		default: false
	},
	stacked: {
		type: Boolean,
		default: false
	},
	locked: {
		type: Boolean,
		default: false
	}
};

module.exports = PanelSchema;
