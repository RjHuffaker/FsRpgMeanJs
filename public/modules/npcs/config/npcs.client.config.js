'use strict';

// Configuring the NPC module
angular.module('npcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Non-player Characters', 'npcs', '/npcs');
	}
]);