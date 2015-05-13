'use strict';

// Moviles controller
angular.module('moviles').controller('MovilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moviles',
	function($scope, $stateParams, $location, Authentication, Moviles) {
		$scope.authentication = Authentication;

		// Create new Movile
		$scope.create = function() {
			// Create new Movile object
			var movile = new Moviles ({
				name: this.name
			});

			// Redirect after save
			movile.$save(function(response) {
				$location.path('moviles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Movile
		$scope.remove = function(movile) {
			if ( movile ) { 
				movile.$remove();

				for (var i in $scope.moviles) {
					if ($scope.moviles [i] === movile) {
						$scope.moviles.splice(i, 1);
					}
				}
			} else {
				$scope.movile.$remove(function() {
					$location.path('moviles');
				});
			}
		};

		// Update existing Movile
		$scope.update = function() {
			var movile = $scope.movile;

			movile.$update(function() {
				$location.path('moviles/' + movile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Moviles
		$scope.find = function() {
			$scope.moviles = Moviles.query();
		};

		// Find existing Movile
		$scope.findOne = function() {
			$scope.movile = Moviles.get({ 
				movileId: $stateParams.movileId
			});
		};
	}
]);