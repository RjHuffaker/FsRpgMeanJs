'use strict';

// Configuring the Articles module
angular.module('architect').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Architect', 'architect', 'dropdown', '/architect(/traits|/feats|/augments|/items)?', true, ['user'], '2');
		Menus.addSubMenuItem('topbar', 'architect', 'PC Traits', 'architect/traits');
		Menus.addSubMenuItem('topbar', 'architect', 'PC Feats', 'architect/feats');
		Menus.addSubMenuItem('topbar', 'architect', 'PC Augments', 'architect/augments');
		Menus.addSubMenuItem('topbar', 'architect', 'PC Items', 'architect/items');
	}
]);