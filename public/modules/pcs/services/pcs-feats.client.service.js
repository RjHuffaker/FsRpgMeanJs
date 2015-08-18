'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsFeats', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Feat Limit
		service.factorFeatLimit = function(pcResource){
			pcResource.featLimit = Math.ceil((pcResource.level) / 4) || 0;
			pcResource.featDeck = pcResource.level;
			service.validateFeats(pcResource);
		};
		
		service.validateFeats = function(pcResource){
			for(var ia = 0; ia < pcResource.featDeck; ia++){
				if(!service.featAtLevel(pcResource, ia + 1)){
					service.addFeat(pcResource, ia + 1);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.featAtLevel = function(pcResource, level){
			var featAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Feat'){
					if(pcResource.cardList[ib].level === level){
						featAtLevel = true;
					}
				}
			}
			return featAtLevel;
		};
		
		service.addFeat = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList);
			
			var _newFeat = {
				_id: 'feat'+level+'Id',
				panelType: 'Feat',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				x_dim: 15,
				y_dim: 21,
				locked: true,
				level: level,
				featData: {
					name: 'Level '+level+' Feat'
				},
				above: {
					adjacent: null, overlap: null
				},
				below: {
					adjacent: null, overlap: null
				},
				left: {
					adjacent: _lastPanel._id, overlap: null
				},
				right: {
					adjacent: null, overlap: null
				}
			};
			
			_lastPanel.right.adjacent = _newFeat._id;
			
			pcResource.cardList.push(_newFeat);
			
			pcResource.$update();
		};
		
		return service;
	}]);
