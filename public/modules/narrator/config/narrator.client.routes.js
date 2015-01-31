'use strict';

//Setting up route
angular.module('narrator').config(['$stateProvider',
	function($stateProvider) {
		// Npcs state routing
		$stateProvider.
		state('listNpcs', {
			url: '/narrator/npcs',
			templateUrl: 'modules/narrator/views/list-npcs.client.view.html'
		});
	}
]);