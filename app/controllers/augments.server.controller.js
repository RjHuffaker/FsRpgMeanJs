'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Augment = mongoose.model('Augment'),
	_ = require('lodash');

/**
 * Create a Augment
 */
exports.create = function(req, res) {
	var augment = new Augment(req.body);
	augment.user = req.user;

	augment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(augment);
		}
	});
};

/**
 * Show the current Augment
 */
exports.read = function(req, res) {
	res.jsonp(req.augment);
};

/**
 * Update a Augment
 */
exports.update = function(req, res) {
	var augment = req.augment;

	augment = _.extend(augment, req.body);

	augment.save(function(err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(augment);
		}
	});
};

/**
 * Delete an Augment
 */
exports.delete = function(req, res) {
	var augment = req.augment ;

	augment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(augment);
		}
	});
};

/**
 * List of Augments
 */
exports.list = function(req, res) {
	Augment.find({ augmentType: req.params.augmentType }).sort('-created').populate('user', 'displayName').exec(function(err, augments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(augments);
		}
	});
};

/**
 * Augment middleware
 */
exports.augmentByID = function(req, res, next, id) {
	Augment.findById(id).populate('user', 'displayName').exec(function(err, augment){
		if (err) console.log(err);
		if (err) return next(err);
		if (! augment) return next(new Error('Failed to load Augment ' + id));
		req.augment = augment;
		next();
	});
};

/**
 * Augment authorization middleware
 */
exports.hasAuthorization = function(req, res, next){
	if(req.augment.user.id !== req.user.id){
		return res.status(403).send('User is not authorized');
	}
	next();
};