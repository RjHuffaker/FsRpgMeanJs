'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsAugments', ['Bakery', 'PanelUtils', 'StackUtils',
	function(Bakery, PanelUtils, StackUtils){
		
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(){
			Bakery.resource.augmentLimit = Math.round((Bakery.resource.level || 0) / 4);
			this.validateAugments();
		};
		
		service.validateAugments = function(){
			for(var ia = 0; ia < Bakery.resource.augmentLimit; ia++){
				if(!this.augmentAtLevel(ia * 4 + 2)){
					this.addAugment(ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < Bakery.resource.cardList.length; ic++){
				if(Bakery.resource.cardList[ic].level > Bakery.resource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.augmentAtLevel = function(level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].panelType === 'Augment'){
					if(Bakery.resource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(level){
			var newAugment = {
				panelType: 'Augment',
				x_coord: PanelUtils.getLastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level,
				augmentData: {
					name: 'Level '+level+' Augment'
				}
			};
			Bakery.resource.cardList.push(newAugment);
		};
		
		return service;
	}]);