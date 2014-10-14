'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var pcs = require('../../app/controllers/pcs');

	// Pcs Routes
	app.route('/pcs')
		.get(pcs.list)
		.post(users.requiresLogin, pcs.create);

	app.route('/pcs/:pcId')
		.get(pcs.read)
		.put(users.requiresLogin, pcs.hasAuthorization, pcs.update)
		.delete(users.requiresLogin, pcs.hasAuthorization, pcs.delete);

	// Finish by binding the Pc middleware
	app.param('pcId', pcs.pcByID);
};