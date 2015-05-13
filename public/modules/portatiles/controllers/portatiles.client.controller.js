'use strict';

// Portatiles controller
angular.module('portatiles').controller('PortatilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Portatiles',
	function($scope, $stateParams, $location, Authentication, Portatiles) {
		$scope.authentication = Authentication;

		// Create new Portatile
		$scope.create = function() {
			// Create new Portatile object
			var portatile = new Portatiles ({
				name: this.name
			});

			// Redirect after save
			portatile.$save(function(response) {
				$location.path('portatiles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portatile
		$scope.remove = function(portatile) {
			if ( portatile ) { 
				portatile.$remove();

				for (var i in $scope.portatiles) {
					if ($scope.portatiles [i] === portatile) {
						$scope.portatiles.splice(i, 1);
					}
				}
			} else {
				$scope.portatile.$remove(function() {
					$location.path('portatiles');
				});
			}
		};

		// Update existing Portatile
		$scope.update = function() {
			var portatile = $scope.portatile;

			portatile.$update(function() {
				$location.path('portatiles/' + portatile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portatiles
		$scope.find = function() {
			$scope.portatiles = Portatiles.query();
		};

		// Find existing Portatile
		$scope.findOne = function() {
			$scope.portatile = Portatiles.get({ 
				portatileId: $stateParams.portatileId
			});
		};
	}
]);