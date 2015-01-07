'use strict';

// Configuring the Articles module
angular.module('cards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cards', 'cards', 'dropdown', '/cards');
		Menus.addSubMenuItem('topbar', 'cards', 'List Traits', 'traits');
		Menus.addSubMenuItem('topbar', 'cards', 'List Feats', 'feats');
		Menus.addSubMenuItem('topbar', 'cards', 'List Augments', 'augments');
		Menus.addSubMenuItem('topbar', 'cards', 'List Items', 'items');
	}
]);