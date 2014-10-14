'use strict';

// Pcs controller
angular.module('pcs').controller('PcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pcs',
	function($scope, $stateParams, $location, Authentication, Pcs ) {
		$scope.authentication = Authentication;

		// Create new Pc
		$scope.create = function() {
			// Create new Pc object
			var pc = new Pcs ({
				name: this.name,
				sex: this.sex,
				race: this.race
			});

			// Redirect after save
			pc.$save(function(response) {
				$location.path('pcs/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.sex = '';
				$scope.race = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pc
		$scope.remove = function( pc ) {
			if ( pc ) { pc.$remove();

				for (var i in $scope.pcs ) {
					if ($scope.pcs [i] === pc ) {
						$scope.pcs.splice(i, 1);
					}
				}
			} else {
				$scope.pc.$remove(function() {
					$location.path('pcs');
				});
			}
		};

		// Update existing Pc
		$scope.update = function() {
			var pc = $scope.pc ;

			pc.$update(function() {
				$location.path('pcs/' + pc._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pcs
		$scope.find = function() {
			$scope.pcs = Pcs.query();
		};

		// Find existing Pc
		$scope.findOne = function() {
			$scope.pc = Pcs.get({ 
				pcId: $stateParams.pcId
			});
		};
	}
]);