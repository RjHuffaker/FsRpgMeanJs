'use strict';
var pcsModule = angular.module('pcs');

// Factory-service for Browsing, Reading, Editting, Adding, and Deleting PCs.
pcsModule.factory('PcsBreadSRVC', ['$stateParams', '$location', 'Authentication', 'Pcs',
	function($stateParams, $location, Authentication, Pcs){
		
		var service = {};

		service.pc = {};

		service.pcList = [];

		// BROWSE Pcs
		service.browsePcs = function() {
			console.log('browse');
			this.pcList = Pcs.query(
				function(response) {
					
				}
			);
		};
		
		// READ single Pc
		service.readPc = function() {
			this.pc = Pcs.get({
				pcId: $stateParams.pcId
			});
		};
		
		// EDIT existing Pc
		service.editPc = function() {
			var pc = this.pc;
			
			pc.$update(function() {
				
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// ADD a new Pc
		service.addPc = function() {
			// Create new Pc object
			this.pc = new Pcs ({});

			this.pc.$save(function() {
			
			}, function(errorResponse) {
				this.error = errorResponse.data.message;
			});
		};
		
		// DELETE existing Pc
		service.deletePc = function(pc) {
			if ( pc ) { pc.$remove();
				for (var i in this.pcs ) {
					if (this.pcs [i] === pc ) {
						this.pcs.splice(i, 1);
					}
				}
			} else {
				this.pc.$remove(function() {
					$location.path('pcs');
				});
			}
			this.browsePcs();
		};
		
		function cardByIndex(index){
			for(var key in service.pc.cardList){
				var card = service.pc.cardList[key];
				if(card.index === index){
					console.log('key: '+key);
					return key;
				}
			}
		}
		
		service.cardListLength = function(){
			var length = 0, key;
			for (key in service.pc.cardList) {
				if (service.pc.cardList.hasOwnProperty(key)) length++;
			}
			return length;
		};
		
		service.shiftLeft = function(index){
			if(index > 0){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index-1);
				
				if(service.pc.cardList[_old].overlap){
					service.pc.cardList[_new].column += 25;
				} else {
					service.pc.cardList[_new].column += 250;
				}
				
				if(service.pc.cardList[_new].overlap){
					service.pc.cardList[_old].column -= 25;
				} else {
					service.pc.cardList[_old].column -= 250;
				}
				service.pc.cardList[_old].index = index-1;
				service.pc.cardList[_new].index = index;
				
			}
			if(service.pc.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.shiftRight = function(index){
			if(index < service.cardListLength() - 1){
				var _old = cardByIndex(index);
				var _new = cardByIndex(index+1);
				
				if(service.pc.cardList[_old].overlap){
					service.pc.cardList[_new].column -= 25;
				} else {
					service.pc.cardList[_new].column -= 250;
				}
				
				if(service.pc.cardList[_new].overlap){
					service.pc.cardList[_old].column += 25;
				} else {
					service.pc.cardList[_old].column += 250;
				}
				service.pc.cardList[_old].index = index+1;
				service.pc.cardList[_new].index = index;
			}
			if(service.pc.cardList[cardByIndex(0)].overlap){
				service.toggleOverlap(0);
			}
		};
		
		service.toggleOverlap = function(index){
			var _card = cardByIndex(index);
			if(service.pc.cardList[_card].overlap){
				
				for(var key1 in service.pc.cardList){
					if(service.pc.cardList[key1].index > index-1){
						service.pc.cardList[key1].column += 225;
					}
				}
				
				service.pc.cardList[_card].overlap = false;
			} else {
				
				for(var key2 in service.pc.cardList){
					if(service.pc.cardList[key2].index > index-1){
						service.pc.cardList[key2].column -= 225;
					}
				}
				
				service.pc.cardList[_card].overlap = true;
			}
		};
		
		return service;
	}]);