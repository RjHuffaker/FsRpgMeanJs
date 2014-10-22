'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var cards = require('../../app/controllers/cards');

	// Cards Routes
	app.route('/cards')
		.post(users.requiresLogin, cards.create)
		.get(cards.list);
	
	app.route('/cards/:cardId')
		.get(cards.read)
		.put(users.requiresLogin, cards.hasAuthorization, cards.update)
		.delete(users.requiresLogin, cards.hasAuthorization, cards.delete);
	
	// Finish by binding the Card middleware
	app.param('cardId', cards.cardByID);
};