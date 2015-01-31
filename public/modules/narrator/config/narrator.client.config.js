'use strict';

// Configuring the NPC module
angular.module('narrator').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Narrator', 'narrator', 'dropdown', '/narrator(/npcs)?', true, ['user'], '1');
		Menus.addSubMenuItem('topbar', 'narrator', 'List My NPCs', 'narrator/npcs');
	}
]);