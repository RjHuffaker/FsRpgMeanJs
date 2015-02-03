'use strict';
var coreModule = angular.module('core');

// Factory-service for managing card-deck, card-slot and card-panel directives.
coreModule.factory('HomeDemo', ['$rootScope',
	function($rootScope){
	
	var service = {};
	
	service.cards = [
		{
			name: 'A Trait Card',
			cardType: 'trait',
			cardRole: 'home',
			x_coord: 0,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'A Feat Card',
			cardType: 'feat',
			cardRole: 'home',
			x_coord: 15,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'An Augment Card',
			cardType: 'augment',
			cardRole: 'home',
			x_coord: 30,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true,
			description: {
				show: true,
				content: 'Truly amazing...'
			}
		},
		{
			name: 'An Item Card',
			cardType: 'item',
			cardRole: 'home',
			x_coord: 45,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'Another Feat Card',
			cardType: 'feat',
			cardRole: 'home',
			x_coord: 60,
			y_coord: 0,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: false,
			locked: true
		},
		{
			name: 'Another Item Card',
			cardType: 'item',
			cardRole: 'home',
			x_coord: 75,
			y_coord: 0,
			x_overlap: false,
			y_overlap: true,
			dragging: false,
			stacked: true,
			locked: true,
			description: {
				show: true,
				content: 'This is the best one by far!!'
			}
		},
		{
			name: 'Yet Another Feat Card',
			cardType: 'feat',
			cardRole: 'home',
			x_coord: 75,
			y_coord: 3,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: true,
			locked: true
		}
	];
	
	return service;
	
	}]);