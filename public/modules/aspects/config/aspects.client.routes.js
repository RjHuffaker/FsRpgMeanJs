'use strict';

//Setting up route
angular.module('aspects').config(['$stateProvider',
	function($stateProvider) {
		// Aspects state routing
		$stateProvider.
		state('listAspects', {
			url: '/aspects',
			templateUrl: 'modules/aspects/views/list-aspects.client.view.html'
		}).
		state('createAspect', {
			url: '/aspects/create',
			templateUrl: 'modules/aspects/views/create-aspect.client.view.html'
		}).
		state('viewAspect', {
			url: '/aspects/:aspectId',
			templateUrl: 'modules/aspects/views/view-aspect.client.view.html'
		}).
		state('editAspect', {
			url: '/aspects/:aspectId/edit',
			templateUrl: 'modules/aspects/views/edit-aspect.client.view.html'
		});
	}
]);