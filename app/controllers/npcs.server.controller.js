'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Npc = mongoose.model('Npc'),
	_ = require('lodash');

/**
 * Create a Npc
 */
exports.create = function(req, res) {
	var npc = new Npc(req.body);
	npc.user = req.user;

	npc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(npc);
		}
	});
};

/**
 * Show the current Npc
 */
exports.read = function(req, res) {
	res.jsonp(req.npc);
};

/**
 * Update a Npc
 */
exports.update = function(req, res) {
	var npc = req.npc ;

	npc = _.extend(npc , req.body);

	npc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(npc);
		}
	});
};

/**
 * Delete an Npc
 */
exports.delete = function(req, res) {
	var npc = req.npc ;

	npc.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(npc);
		}
	});
};

/**
 * List of Npcs
 */
exports.list = function(req, res) { Npc.find().sort('-created').populate('user', 'displayName').exec(function(err, npcs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(npcs);
		}
	});
};

/**
 * Npc middleware
 */
exports.npcByID = function(req, res, next, id) { Npc.findById(id).populate('user', 'displayName').exec(function(err, npc) {
		if (err) return next(err);
		if (! npc) return next(new Error('Failed to load Npc ' + id));
		req.npc = npc ;
		next();
	});
};

/**
 * Npc authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.npc.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};