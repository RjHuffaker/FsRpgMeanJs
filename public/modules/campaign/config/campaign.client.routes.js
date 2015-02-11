'use strict';

//Setting up route
angular.module('campaign').config(['$stateProvider',
	function($stateProvider) {
		// Campaign state routing
		$stateProvider.
		state('campaign', {
			url: '/campaign',
			templateUrl: 'modules/campaign/views/campaign.client.view.html'
		});
	}
]);