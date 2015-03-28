'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Deck = mongoose.model('Deck'),
    _ = require('lodash');

/**
 * Create a Deck
 */
exports.create = function(req, res) {
	var deck = new Deck(req.body);
	deck.user = req.user;
	
	deck.save(function(err){
		if (err) {
			console.log('save error');
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deck);
		}
	});
};

/**
 * Show the current Deck
 */
exports.read = function(req, res) {
	res.jsonp(req.deck);
};

/**
 * Update a Deck
 */
exports.update = function(req, res) {
	var deck = req.deck ;

	deck = _.extend(deck, req.body);
	
	deck.save(function(err) {
		if (err) {
			console.log('save error');
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deck);
		}
	});
};

/**
 * Delete a Deck
 */
exports.delete = function(req, res) {
	var deck = req.deck;

	deck.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deck);
		}
	});
};

/**
 * List of Decks
 */
exports.list = function(req, res) {
	console.log('list');
	Deck.find( { user: req.user._id } ).sort('-created').populate('user', 'displayName').exec(function(err, decks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(decks);
		}
	});
};

/**
 * Deck middleware
 */
exports.deckByID = function(req, res, next, id){
	Deck.findById(id)
		.populate('user', 'displayName')
		.populate('cardList.traitData')
		.populate('cardList.featData')
		.populate('cardList.augmentData')
		.populate('cardList.itemData')
		.populate('cardList.originData')
		.exec(
			function(err, deck) {
				if (err) return next(err);
				if (! deck) return next(new Error('Failed to load Deck ' + id));
				
				
				req.deck = deck;
				next();
			});
	
	
};

/**
 * Deck authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.deck.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};