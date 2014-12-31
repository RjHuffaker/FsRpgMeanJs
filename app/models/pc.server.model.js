'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Dice = require('./dice.server.model'),
	Schema = mongoose.Schema;

var DiceSchema = new Schema(Dice);

/**
 * Ability Schema
 */
var AbilitySchema = new Schema({
	name: {
		type: String,
		default: ''
	},
	order: {
		type: Number,
		default: 0
	},
	dice: Dice
});

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
	name: {
		type: String,
		default: ''
	},
	sex: {
		type: String,
		default: '---'
	},
	race: {
		type: String,
		default: 'Weolda'
	},
	abilities: [
		AbilitySchema
	],
	dicepool: [
		DiceSchema
	],
	block: {
		type: String,
		default: '2d__'
	},
	dodge: {
		type: String,
		default: '2d__'
	},
	alertness: {
		type: String,
		default: '2d__'
	},
	tenacity: {
		type: String,
		default: '2d__'
	},
	level: {
		type: Number,
		default: 0
	},
	experience: {
		type: Number,
		default: 0
	},
	healthLimit: {
		type: Number,
		default: 0
	},
	healthCurrent: {
		type: Number,
		default: 0
	},
	injury: {
		type: Number,
		default: 0
	},
	staminaLimit: {
		type: Number,
		default: 0
	},
	staminaCurrent: {
		type: Number,
		default: 0
	},
	fatigue: {
		type: Number,
		default: 0
	},
	size: {
		type: String,
		default: 'Medium'
	},
	speed: {
		type: Number,
		default: 6
	},
	archetype: {
		type: String,
		default: 'General'
	},
	allegiance: {
		type: String,
		default: 'Unaligned'
	},
	traitLimit: {
		type: Number,
		default: 1
	},
	featLimit: {
		type: Number,
		default: 0
	},
	augmentLimit: {
		type: Number,
		default: 0
	},
	defenseModifier: {
		type: Number,
		default: 0
	},
	damageModifier: {
		type: Number,
		default: 0
	},
	baseDurability: {
		type: Number,
		default: 0
	},
	totalDurability: {
		type: Number,
		default: 0
	},
	cards: []
});

mongoose.model('Pc', PcSchema);