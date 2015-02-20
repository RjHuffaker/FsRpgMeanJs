'use strict';

//Setting up route
angular.module('narrator').config(['$stateProvider',
	function($stateProvider) {
		// Npcs state routing
		$stateProvider.
		state('listNpcs', {
			url: '/narrator/npcs',
			templateUrl: 'modules/narrator/views/list-npcs.client.view.html'
		}).
		state('listNarratorCampaigns', {
			url: '/narrator/campaigns',
			templateUrl: 'modules/campaign/views/list-narrator-campaigns.client.view.html'
		}).
		state('editNarratorCampaign', {
			url: '/narrator/campaigns/:campaignId/edit',
			templateUrl: 'modules/campaigns/views/edit-narrator-campaign.client.view.html'
		});
	}
]);