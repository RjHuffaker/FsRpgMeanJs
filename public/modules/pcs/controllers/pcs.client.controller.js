'use strict';

// Pcs controller
var pcsModule = angular.module('pcs');

pcsModule.controller('PcsController', ['$scope', '$stateParams', 'Authentication', 'Pcs', '$modal', '$log',
	function($scope, $stateParams, Authentication, Pcs, $modal, $log) {
		this.authentication = Authentication;
		
		// Find a list of Pcs
		this.pcs = Pcs.query();
		
		// Open modal window to create PC
		this.openCreateModal = function (size) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/pcs/views/create-pc.client.view.html',
				controller: function ($scope, $modalInstance){
					$scope.ok = function () {
						$modalInstance.close($scope.pc);
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					pc: function () {
						console.log("resolve");
						
					}
				}
			});

			modalInstance.result.then(function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
		
		// Open modal window to update PC
		this.openUpdateModal = function (size, selectPc) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/pcs/views/edit-pc.client.view.html',
				controller: function ($scope, $modalInstance, pc){
					$scope.pc = pc;
					
					$scope.ok = function () {
						$modalInstance.close($scope.pc);
					};
					
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					pc: function () {
						return selectPc;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
		// Remove existing Pc
		this.remove = function( pc ) {
			if ( pc ) { pc.$remove();
				for (var i in this.pcs ) {
					if (this.pcs [i] === pc ) {
						this.pcs.splice(i, 1);
					}
				}
			} else {
				this.pc.$remove(function() {
				});
			}
		};
		
}]);

pcsModule.controller('PcsCreateController', ['$scope', 'Pcs',
	function($scope, Pcs ) {
		// Create new Pc
		this.create = function() {
			// Create new Pc object
			var pc = new Pcs ({
				name: this.name,
				sex: this.sex,
				race: this.race
			});

			pc.$save(function(response) {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	
}]);

pcsModule.controller('PcsUpdateController', ['$scope', 'Pcs',
	function($scope, Pcs ) {
		// Update existing Pc
		this.update = function(updatedPc) {
			var pc = updatedPc;

			pc.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
}]);

pcsModule.directive('pcList', [function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/pcs/views/pc-list-template.html',
		link: function(scope, element, attrs){
			
		}
	};
}]);
