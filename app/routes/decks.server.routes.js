'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var decks = require('../../app/controllers/decks');
	
	// Decks Routes
	app.route('/decks')
		.get(users.requiresLogin, decks.list)
		.post(users.requiresLogin, decks.create);
	
	app.route('/decks/:deckId')
		.get(decks.read)
		.put(users.requiresLogin, decks.hasAuthorization, decks.update)
		.delete(users.requiresLogin, decks.hasAuthorization, decks.delete);

	// Finish by binding the Deck middleware
	app.param('deckId', decks.deckByID);
	
};