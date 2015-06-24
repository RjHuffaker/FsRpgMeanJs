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
	aboveId: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	belowId: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	leftId: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
	},
	rightId: {
		type: Schema.Types.ObjectId,
		ref: 'Panel'
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
