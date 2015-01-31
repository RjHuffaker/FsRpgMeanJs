'use strict';

//Setting up route
angular.module('player').config(['$stateProvider',
	function($stateProvider) {
		// player state routing
		$stateProvider.
		state('listPcs', {
			url: '/player/pcs',
			templateUrl: 'modules/player/views/list-pcs.client.view.html'
		}).
		state('editPc', {
			url: '/player/pcs/:pcId/edit',
			templateUrl: 'modules/player/views/edit-pc.client.view.html'
		});
	}
]);