'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Pc = mongoose.model('Pc'),
	_ = require('lodash');

/**
 * Create a Pc
 */
exports.create = function(req, res) {
	var pc = new Pc(req.body);
	pc.user = req.user;

	pc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pc);
		}
	});
};

/**
 * Show the current Pc
 */
exports.read = function(req, res) {
	res.jsonp(req.pc);
};

/**
 * Update a Pc
 */
exports.update = function(req, res) {
	var pc = req.pc ;

	pc = _.extend(pc , req.body);

	pc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pc);
		}
	});
};

/**
 * Delete a Pc
 */
exports.delete = function(req, res) {
	var pc = req.pc ;

	pc.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pc);
		}
	});
};

/**
 * List of Pcs
 */
exports.list = function(req, res) { Pc.find().sort('-created').populate('user', 'displayName').exec(function(err, pcs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pcs);
		}
	});
};

/**
 * Pc middleware
 */
exports.pcByID = function(req, res, next, id) { Pc.findById(id).populate('user', 'displayName').exec(function(err, pc) {
		if (err) return next(err);
		if (! pc) return next(new Error('Failed to load Pc ' + id));
		req.pc = pc ;
		next();
	});
};

/**
 * Pc authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pc.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};