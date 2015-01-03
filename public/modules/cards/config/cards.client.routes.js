'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
	function($stateProvider) {
		// Cards state routing
		$stateProvider.
		state('listCards', {
			url: '/cards',
			templateUrl: 'modules/cards/views/list-cards.client.view.html'
		});
	}
]);