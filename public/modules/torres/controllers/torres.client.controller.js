'use strict';

// Torres controller
angular.module('torres').controller('TorresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Torres',
	function($scope, $stateParams, $location, Authentication, Torres) {
		$scope.authentication = Authentication;

		// Create new Torre
		$scope.create = function() {
			// Create new Torre object
			var torre = new Torres ({
				name: this.name
			});

			// Redirect after save
			torre.$save(function(response) {
				$location.path('torres/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Torre
		$scope.remove = function(torre) {
			if ( torre ) { 
				torre.$remove();

				for (var i in $scope.torres) {
					if ($scope.torres [i] === torre) {
						$scope.torres.splice(i, 1);
					}
				}
			} else {
				$scope.torre.$remove(function() {
					$location.path('torres');
				});
			}
		};

		// Update existing Torre
		$scope.update = function() {
			var torre = $scope.torre;

			torre.$update(function() {
				$location.path('torres/' + torre._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Torres
		$scope.find = function() {
			$scope.torres = Torres.query();
		};

		// Find existing Torre
		$scope.findOne = function() {
			$scope.torre = Torres.get({ 
				torreId: $stateParams.torreId
			});
		};
	}
]);