'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var decks = require('../../app/controllers/decks');
	
	// Deck Routes
	app.route('/decks')
		.get(decks.list);
	
	app.route('/decks/:deckType')
		.get(decks.query);
	
	app.route('/deck')
		.post(users.requiresLogin, decks.create);
	
	app.route('/deck/:deckId')
		.get(decks.populateAspects, decks.read)
		.put(users.requiresLogin, decks.hasAuthorization, decks.update)
		.delete(users.requiresLogin, decks.hasAuthorization, decks.delete);

	// Finish by binding the Deck middleware
	app.param('deckId', decks.deckByID);
	
};