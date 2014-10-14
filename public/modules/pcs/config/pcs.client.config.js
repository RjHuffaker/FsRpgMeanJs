'use strict';

// Configuring the Articles module
angular.module('pcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pcs', 'pcs', 'dropdown', '/pcs(/create)?');
		Menus.addSubMenuItem('topbar', 'pcs', 'List Pcs', 'pcs');
		Menus.addSubMenuItem('topbar', 'pcs', 'New Pc', 'pcs/create');
	}
]);