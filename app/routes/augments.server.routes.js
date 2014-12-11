'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var augments = require('../../app/controllers/augments');

	// Traits Routes
	app.route('/augments')
		.post(users.requiresLogin, augments.create)
		.get(augments.list);
	
	app.route('/augments/:augmentId')
		.get(augments.read)
		.put(users.requiresLogin, augments.hasAuthorization, augments.update)
		.delete(users.requiresLogin, augments.hasAuthorization, augments.delete);
	
	// Finish by binding the Augment middleware
	app.param('augmentId', augments.augmentByID);
};