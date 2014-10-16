'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var npcs = require('../../app/controllers/npcs');

	// Npcs Routes
	app.route('/npcs')
		.get(npcs.list)
		.post(users.requiresLogin, npcs.create);

	app.route('/npcs/:npcId')
		.get(npcs.read)
		.put(users.requiresLogin, npcs.hasAuthorization, npcs.update)
		.delete(users.requiresLogin, npcs.hasAuthorization, npcs.delete);

	// Finish by binding the Npc middleware
	app.param('npcId', npcs.npcByID);
};