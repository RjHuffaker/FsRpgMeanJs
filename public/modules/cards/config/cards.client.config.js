'use strict';

// Configuring the Articles module
angular.module('cards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cards', 'cards', 'dropdown', '/cards(/create)?');
		Menus.addSubMenuItem('topbar', 'cards', 'List Cards', 'cards');
		Menus.addSubMenuItem('topbar', 'cards', 'New Card', 'cards/create');
	}
]);