'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Feat = mongoose.model('Feat'),
	_ = require('lodash');

/**
 * Create a Feat
 */
exports.create = function(req, res) {
	var feat = new Feat(req.body);
	feat.user = req.user;

	feat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feat);
		}
	});
};

/**
 * Show the current Feat
 */
exports.read = function(req, res) {
	res.jsonp(req.feat);
};

/**
 * Update a Feat
 */
exports.update = function(req, res) {
	var feat = req.feat;

	feat = _.extend(feat, req.body);

	feat.save(function(err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feat);
		}
	});
};

/**
 * Delete an Feat
 */
exports.delete = function(req, res) {
	var feat = req.feat ;

	feat.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feat);
		}
	});
};

/**
 * List of Feats
 */
exports.list = function(req, res) {
	Feat.find({ featType: req.params.featType }).sort('-created').populate('user', 'displayName').exec(function(err, feats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feats);
		}
	});
};

/**
 * Feat middleware
 */
exports.featByID = function(req, res, next, id) {
	Feat.findById(id).populate('user', 'displayName').exec(function(err, feat){
		if (err) console.log(err);
		if (err) return next(err);
		if (! feat) return next(new Error('Failed to load Feat ' + id));
		req.feat = feat;
		next();
	});
};

/**
 * Feat authorization middleware
 */
exports.hasAuthorization = function(req, res, next){
	if(req.feat.user.id !== req.user.id){
		return res.status(403).send('User is not authorized');
	}
	next();
};