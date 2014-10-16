'use strict';

//Setting up route
angular.module('npcs').config(['$stateProvider',
	function($stateProvider) {
		// Npcs state routing
		$stateProvider.
		state('listNpcs', {
			url: '/npcs',
			templateUrl: 'modules/npcs/views/list-npcs.client.view.html'
		});
	}
]);