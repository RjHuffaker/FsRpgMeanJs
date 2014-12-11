'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var feats = require('../../app/controllers/feats');

	// Traits Routes
	app.route('/feats')
		.post(users.requiresLogin, feats.create)
		.get(feats.list);
	
	app.route('/feats/:featId')
		.get(feats.read)
		.put(users.requiresLogin, feats.hasAuthorization, feats.update)
		.delete(users.requiresLogin, feats.hasAuthorization, feats.delete);
	
	// Finish by binding the Feat middleware
	app.param('featId', feats.featByID);
};