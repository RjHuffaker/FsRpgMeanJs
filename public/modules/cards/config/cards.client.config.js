'use strict';

// Configuring the Articles module
angular.module('cards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cards', 'cards', '/cards');
	}
]);