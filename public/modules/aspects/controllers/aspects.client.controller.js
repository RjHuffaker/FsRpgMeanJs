'use strict';

// Aspects controller
angular.module('aspects').controller('AspectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Aspects',
	function($scope, $stateParams, $location, Authentication, Aspects) {
		$scope.authentication = Authentication;

		// Create new Aspect
		$scope.create = function() {
			// Create new Aspect object
			var aspect = new Aspects ({
				name: this.name
			});

			// Redirect after save
			aspect.$save(function(response) {
				$location.path('aspects/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Aspect
		$scope.remove = function(aspect) {
			if ( aspect ) { 
				aspect.$remove();

				for (var i in $scope.aspects) {
					if ($scope.aspects [i] === aspect) {
						$scope.aspects.splice(i, 1);
					}
				}
			} else {
				$scope.aspect.$remove(function() {
					$location.path('aspects');
				});
			}
		};

		// Update existing Aspect
		$scope.update = function() {
			var aspect = $scope.aspect;

			aspect.$update(function() {
				$location.path('aspects/' + aspect._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Aspects
		$scope.find = function() {
			$scope.aspects = Aspects.query();
		};

		// Find existing Aspect
		$scope.findOne = function() {
			$scope.aspect = Aspects.get({ 
				aspectId: $stateParams.aspectId
			});
		};
	}
]);