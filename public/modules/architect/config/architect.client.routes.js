'use strict';

//Setting up route
angular.module('architect').config(['$stateProvider',
	function($stateProvider) {
		// Architect state routing
		$stateProvider.
		state('editTraits', {
			url: '/architect/traits',
			templateUrl: 'modules/architect/views/edit-traits.client.view.html'
		}).
		state('editFeats', {
			url: '/architect/feats',
			templateUrl: 'modules/architect/views/edit-feats.client.view.html'
		}).
		state('editAugments', {
			url: '/architect/augments',
			templateUrl: 'modules/architect/views/edit-augments.client.view.html'
		}).
		state('editItems', {
			url: '/architect/items',
			templateUrl: 'modules/architect/views/edit-items.client.view.html'
		});
	}
]);