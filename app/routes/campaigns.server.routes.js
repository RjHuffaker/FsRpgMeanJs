'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var campaigns = require('../../app/controllers/campaigns');

	// Campaign Routes
	app.route('/campaigns')
		.post(users.requiresLogin, campaigns.create)
		.get(campaigns.list);
	
	app.route('/campaigns/:campaignId')
		.get(campaigns.read)
		.put(users.requiresLogin, campaigns.hasAuthorization, campaigns.update)
		.delete(users.requiresLogin, campaigns.hasAuthorization, campaigns.delete);
	
	// Finish by binding the Campaign middleware
	app.param('campaignId', campaigns.campaignByID);
};