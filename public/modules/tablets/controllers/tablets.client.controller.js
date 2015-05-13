'use strict';

// Tablets controller
angular.module('tablets').controller('TabletsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tablets',
	function($scope, $stateParams, $location, Authentication, Tablets) {
		$scope.authentication = Authentication;

		// Create new Tablet
		$scope.create = function() {
			// Create new Tablet object
			var tablet = new Tablets ({
				name: this.name
			});

			// Redirect after save
			tablet.$save(function(response) {
				$location.path('tablets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tablet
		$scope.remove = function(tablet) {
			if ( tablet ) { 
				tablet.$remove();

				for (var i in $scope.tablets) {
					if ($scope.tablets [i] === tablet) {
						$scope.tablets.splice(i, 1);
					}
				}
			} else {
				$scope.tablet.$remove(function() {
					$location.path('tablets');
				});
			}
		};

		// Update existing Tablet
		$scope.update = function() {
			var tablet = $scope.tablet;

			tablet.$update(function() {
				$location.path('tablets/' + tablet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tablets
		$scope.find = function() {
			$scope.tablets = Tablets.query();
		};

		// Find existing Tablet
		$scope.findOne = function() {
			$scope.tablet = Tablets.get({ 
				tabletId: $stateParams.tabletId
			});
		};
	}
]);