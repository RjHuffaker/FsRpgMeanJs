'use strict';

// Configuring the PC module
angular.module('pcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Player Characters', 'pcs', '/pcs');
	}
]);