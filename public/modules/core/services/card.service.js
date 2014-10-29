

// Factory-service for managing stuff
angular.module('core').factory('CardService', [
	function($http, $rootScope){
		'use strict';
		var service = {};
		
		service.cardList = [
			{ id: 1, name: 'Item 1', overlap: false, invisible: false },
			{ id: 2, name: 'Item 2', overlap: true, invisible: false },
			{ id: 3, name: 'Item 3', overlap: true, invisible: false },
			{ id: 4, name: 'Item 4', overlap: true, invisible: false },
			{ id: 5, name: 'Item 5', overlap: false, invisible: false },
			{ id: 6, name: 'Item 6', overlap: true, invisible: false },
			{ id: 7, name: 'Item 7', overlap: false, invisible: false },
			{ id: 8, name: 'Item 8', overlap: true, invisible: false }
		];
		
		service.addCard = function(){
			var newId = this.cardList.length + 1;
				
			this.cardList.push({
				id: newId,
				name: 'Item '+newId,
				overlap: 0
			});
		};
		
		service.removeCard = function(){
			this.cardList.splice(0, 1);
		};
		
		return service;
	}]);