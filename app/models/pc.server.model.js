'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	cardList:{
		pcCard1: {
			index: {
				type: Number,
				default: 0
			},
			cardType: {
				type: String,
				default: 'pcCard1'
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
			race: {
				type: String,
				default: 'Weolda'
			}
		},
		pcCard2: {
			index: {
				type: Number,
				default: 1
			},
			cardType: {
				type: String,
				default: 'pcCard2'
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
		pcCard3: {
			index: {
				type: Number,
				default: 2
			},
			cardType: {
				type: String,
				default: 'pcCard3'
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