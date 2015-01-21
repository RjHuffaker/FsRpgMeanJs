'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
	function($stateProvider) {
		// Cards state routing
		$stateProvider.
		state('listTraits', {
			url: '/traits',
			templateUrl: 'modules/cards/views/list-traits.client.view.html'
		}).
		state('listFeats', {
			url: '/feats',
			templateUrl: 'modules/cards/views/list-feats.client.view.html'
		}).
		state('listAugments', {
			url: '/augments',
			templateUrl: 'modules/cards/views/list-augments.client.view.html'
		}).
		state('listItems', {
			url: '/items',
			templateUrl: 'modules/cards/views/list-items.client.view.html'
		});
	}
]);