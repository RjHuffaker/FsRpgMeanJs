'use strict';

// Configuring the Articles module
angular.module('pcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Player Characters', 'pcs', 'dropdown', '/pcs(/create)?');
		Menus.addSubMenuItem('topbar', 'pcs', 'List Player Characters', 'pcs');
		Menus.addSubMenuItem('topbar', 'pcs', 'New Player Character', 'pcs/create');
	}
]);