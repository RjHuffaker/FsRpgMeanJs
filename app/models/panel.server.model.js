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
	x_coord: {
		type: Number
	},
	y_coord: {
		type: Number
	},
	x_above: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	y_above: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	x_below: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	y_below: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	x_overlap: {
		type: Boolean,
		default: false
	},
	y_overlap: {
		type: Boolean,
		default: false
	},
	x_stack: {
		type: Boolean,
		default: false
	},
	y_stack: {
		type: Boolean,
		default: false
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
