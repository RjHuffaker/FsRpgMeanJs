'use strict';

// Configuring the PC module
angular.module('player').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Player', 'player', 'dropdown', '/player(/pcs)?', true, ['user'], '0');
		Menus.addSubMenuItem('topbar', 'player', 'List My PCs', 'player/pcs');
	}
]);