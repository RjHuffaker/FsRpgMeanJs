'use strict';

//Setting up route
angular.module('architect').config(['$stateProvider',
	function($stateProvider) {
		// Architect state routing
		$stateProvider.
		state('editTraits', {
			url: '/architect/traits',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('editFeats', {
			url: '/architect/feats',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('editAugments', {
			url: '/architect/augments',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('editItems', {
			url: '/architect/items',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('editOrigins', {
			url: '/architect/origins',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);