'use strict';

// Factory-service for managing PC card deck.
angular.module('pcs').factory('PcsAugments', ['PanelUtils',
	function(PanelUtils){
		
		var service = {};
		
		// Factor Augment Limit
		service.factorAugmentLimit = function(pcResource){
			pcResource.augmentLimit = Math.round((pcResource.level || 0) / 4);
			service.validateAugments(pcResource);
		};
		
		service.validateAugments = function(pcResource){
			for(var ia = 0; ia < pcResource.augmentLimit; ia++){
				if(!service.augmentAtLevel(pcResource, ia * 4 + 2)){
					service.addAugment(pcResource, ia * 4 + 2);
				}
			}
			for(var ic = 0; ic < pcResource.cardList.length; ic++){
				if(pcResource.cardList[ic].level > pcResource.level){
					console.log('TODO: remove card');
				}
			}
		};
		
		service.augmentAtLevel = function(pcResource, level){
			var augmentAtLevel = false;
			for(var ib = 0; ib < pcResource.cardList.length; ib++){
				if(pcResource.cardList[ib].panelType === 'Augment'){
					if(pcResource.cardList[ib].level === level){
						augmentAtLevel = true;
					}
				}
			}
			return augmentAtLevel;
		};
		
		service.addAugment = function(pcResource, level){
			var _lastPanel = PanelUtils.getLast(pcResource.cardList);
			
			var _newAugment = {
				_id: 'augment'+level+'Id',
				panelType: 'Augment',
				x_coord: _lastPanel.x_coord + 15,
				y_coord: 0,
				x_dim: 15,
				y_dim: 21,
				locked: true,
				level: level,
				augmentData: {
					_name: 'Level '+level+' Augment'
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
			
			_lastPanel.right.adjacent = _newAugment._id;
			
			pcResource.cardList.push(_newAugment);
			
			pcResource.$update();
		};
		
		return service;
	}]);