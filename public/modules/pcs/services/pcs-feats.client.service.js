'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['Bakery', 'PanelUtils', 'StackUtils',
	function(Bakery, PanelUtils, StackUtils){
		
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(){
			Bakery.resource.featLimit = Math.ceil((Bakery.resource.level) / 4) || 0;
			Bakery.resource.featDeck = Bakery.resource.level;
			this.validateFeats();
		};
		
		service.validateFeats = function(){
			for(var ia = 0; ia < Bakery.resource.featDeck; ia++){
				if(!this.featAtLevel(ia + 1)){
					this.addFeat(ia + 1);
				}
			}
			for(var ic = 0; ic < Bakery.resource.cardList.length; ic++){
				if(Bakery.resource.cardList[ic].level > Bakery.resource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.featAtLevel = function(level){
			var featAtLevel = false;
			for(var ib = 0; ib < Bakery.resource.cardList.length; ib++){
				if(Bakery.resource.cardList[ib].panelType === 'Feat'){
					if(Bakery.resource.cardList[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(level){
			var newFeat = {
				panelType: 'Feat',
				x_coord: PanelUtils.getLastPanel(Bakery.resource.cardList).panel.x_coord + 15,
				y_coord: 0,
				x_overlap: false,
				y_overlap: false,
				dragging: false,
				stacked: false,
				locked: true,
				level: level,
				featData: {
					name: 'Level '+level+' Feat'
				}
			};
			Bakery.resource.cardList.push(newFeat);
		};
		
		return service;
	}]);
