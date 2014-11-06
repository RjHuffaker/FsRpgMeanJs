

// Factory-service for managing stuff
angular.module('core').factory('CardService', [
	function($http, $rootScope){
		'use strict';
		var service = {};
		
		service.cardList = [
			{ index: 0, name: '0', overlap: false },
			{ index: 1, name: '1', overlap: false },
			{ index: 2, name: '2', overlap: true },
			{ index: 3, name: '3', overlap: true },
			{ index: 4, name: '4', overlap: true },
			{ index: 5, name: '5', overlap: true },
			{ index: 6, name: '6', overlap: false },
			{ index: 7, name: '7', overlap: false }
		];
		
		service.addCard = function(){
			var newIndex = this.cardList.length;
				
			this.cardList.push({
				index: newIndex,
				name: 'Item '+newIndex,
				overlap: true
			});
		};
		
		service.removeCard = function(){
			this.cardList.splice(this.cardList.length-1, 1);
		};
		
		service.toggleOverlap = function(index){
			this.cardList[index].overlap = !this.cardList[index].overlap;
		};
		
		service.reorderList = function(oldIndex, newIndex){
			if(newIndex >= 0 && newIndex <= this.cardList.length){
				console.log('moveCard: '+oldIndex+' to '+ newIndex);
				var index_old = this.cardList[oldIndex].index;
				var index_new = this.cardList[newIndex].index;
				this.cardList[oldIndex].index = index_new;
				this.cardList[newIndex].index = index_old;
				this.cardList.sort(function(a, b){
					return a.index - b.index;
				});
				console.log(this.cardList);
			}
		};
		
		return service;
	}]);