'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
	Origin = mongoose.model('Origin'),
	_ = require('lodash');

/**
 * Create an Origin
 */
exports.create = function(req, res) {
	var origin = new Origin(req.body);
	origin.user = req.user;
	
	origin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(origin);
		}
	});
};

/**
 * Show the current Origin
 */
exports.read = function(req, res) {
	res.jsonp(req.origin);
};

/**
 * Update a Origin
 */
exports.update = function(req, res) {
	var origin = req.origin;

	origin = _.extend(origin, req.body);

	origin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(origin);
		}
	});
};

/**
 * Delete an Origin
 */
exports.delete = function(req, res) {
	var origin = req.origin ;

	origin.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(origin);
		}
	});
};

/**
 * List of Origins
 */
exports.list = function(req, res){
	Origin.find().exec(function(err, origins){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(origins);
		}
	});
};

/**
 * Origin middleware
 */
exports.originByID = function(req, res, next, id){
	Origin.findById(id).populate('user', 'displayName').exec(function(err, origin){
		if (err) return next(err);
		if (! origin) return next(new Error('Failed to load Origin ' + id));
		req.origin = origin;
		next();
	});
};

/**
 * Origin authorization middleware
 */
exports.hasAuthorization = function(req, res, next){
	if (req.origin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};