'use strict';

//Setting up route
angular.module('player').config(['$stateProvider',
	function($stateProvider) {
		// Player state routing
		$stateProvider.
		state('listPcs', {
			url: '/player/pcs',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('editPc', {
			url: '/player/pcs/:pcId/edit',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('listPlayerCampaigns', {
			url: '/player/campaigns',
			templateUrl: 'modules/campaign/views/list-player-campaigns.client.view.html'
		}).
		state('editPlayerCampaign', {
			url: '/player/campaigns/:campaignId/edit',
			templateUrl: 'modules/campaigns/views/edit-player-campaign.client.view.html'
		});
	}
]);