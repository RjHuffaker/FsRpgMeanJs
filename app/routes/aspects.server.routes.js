'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var aspects = require('../../app/controllers/aspects.server.controller');

	// Aspects Routes
	app.route('/aspects')
		.get(aspects.list)
		.post(users.requiresLogin, aspects.create);

	app.route('/aspects/:aspectId')
		.get(aspects.read)
		.put(users.requiresLogin, aspects.hasAuthorization, aspects.update)
		.delete(users.requiresLogin, aspects.hasAuthorization, aspects.delete);

	// Finish by binding the Aspect middleware
	app.param('aspectId', aspects.aspectByID);
};
