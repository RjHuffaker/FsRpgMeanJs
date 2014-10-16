'use strict';

//Setting up route
angular.module('pcs').config(['$stateProvider',
	function($stateProvider) {
		// Pcs state routing
		$stateProvider.
		state('listPcs', {
			url: '/pcs',
			templateUrl: 'modules/pcs/views/list-pcs.client.view.html'
		});
	}
]);