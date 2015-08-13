'use strict';

// Factory-service for managing PC traits
angular.module('pcs').factory('PcsTraits', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(pcResource){
			pcResource.traitLimit = Math.floor((pcResource.level || 0) / 4 + 1);
			service.validateTraits(pcResource);
		};
		
		service.validateTraits = function(pcResource){
			for(var ia = 0; ia < pcResource.traitLimit; ia++){
				if(!service.traitAtLevel(pcResource, ia * 4)){
					service.addTrait(pcResource, ia * 4);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.traitAtLevel = function(pcResource, level){
			var traitAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Trait'){
					if(pcResource.cardList[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList).panel;
			
			var _newTrait = {
				_id: 'trait'+level+'Id',
				panelType: 'Trait',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				x_dim: 15,
				y_dim: 21,
				locked: true,
				level: level,
				traitData: {
					name: 'Level '+level+' Trait'
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
			
			_lastPanel.right.adjacent = _newTrait._id;
			
			pcResource.cardList.push(_newTrait);
			
			pcResource.$update();
		};
		
		return service;
	}]);