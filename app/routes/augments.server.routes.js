'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var augments = require('../../app/controllers/augments');

	// Augments Routes
	app.route('/augments')
		.post(users.requiresLogin, augments.create);
	
	app.route('/augments/:augmentType')
		.get(augments.list);
	
	app.route('/augments/:augmentId')
		.get(augments.read)
		.put(users.requiresLogin, augments.hasAuthorization, augments.update)
		.delete(users.requiresLogin, augments.hasAuthorization, augments.delete);
	
	// Finish by binding the Augment middleware
	app.param('augmentId', augments.augmentByID);
};