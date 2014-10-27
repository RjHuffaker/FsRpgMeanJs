'use strict';

var coreModule = angular.module('core');

// Core Controller
coreModule.controller('HomeController', ['$scope', 'Authentication', 'CardService',
	function($scope, Authentication, CardService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.CardSRVC = CardService;
		
		$scope.gridsterOpts = {
			columns: 10,
			colWidth: 250,
			rowHeight: 450,
			width: 'auto',
			margins: [50, 0],
			outerMargin: true,
			pushing: true,
			floating: true,
			draggable: {
				enabled: true
			},
			minColumns: 5,
			maxRows: 1,
			minRows: 1
		};

		$scope.customItemMap = {
			sizeX: 'item.size.x',
			sizeY: 'item.size.y',
			row: '0',
			col: 'item.position[1]'
		};
		
	}
]);