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
			deckType: 'home',
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
			deckType: 'home',
			x_coord: 10,
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
			deckType: 'home',
			x_coord: 20,
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
			deckType: 'home',
			x_coord: 30,
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
			deckType: 'home',
			x_coord: 40,
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
			deckType: 'home',
			x_coord: 50,
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
			deckType: 'home',
			x_coord: 50,
			y_coord: 2,
			x_overlap: false,
			y_overlap: false,
			dragging: false,
			stacked: true,
			locked: true
		}
	];
	
	return service;
	
	}]);