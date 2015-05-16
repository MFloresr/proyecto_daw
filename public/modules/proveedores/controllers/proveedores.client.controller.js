'use strict';

// Proveedores controller
angular.module('proveedores').controller('ProveedoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proveedores',
	function($scope, $stateParams, $location, Authentication, Proveedores) {
		$scope.authentication = Authentication;

		// Create new Proveedore
		$scope.create = function() {
			// Create new Proveedore object
			var proveedore = new Proveedores ({
				nombre: this.nombre,
				telefono: this.telefono,
				correo: this.correo
			});

			// Redirect after save
			proveedore.$save(function(response) {
				$location.path('proveedores/' + response._id);

				// Clear form fields
				$scope.nombre = '';
				$scope.telefono = '';
				$scope.correo = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proveedore
		$scope.remove = function(proveedore) {
			if ( proveedore ) { 
				proveedore.$remove();

				for (var i in $scope.proveedores) {
					if ($scope.proveedores [i] === proveedore) {
						$scope.proveedores.splice(i, 1);
					}
				}
			} else {
				$scope.proveedore.$remove(function() {
					$location.path('proveedores');
				});
			}
		};

		// Update existing Proveedore
		$scope.update = function() {
			var proveedore = $scope.proveedore;

			proveedore.$update(function() {
				$location.path('proveedores/' + proveedore._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proveedores
		$scope.find = function() {
			$scope.proveedores = Proveedores.query();
		};

		// Find existing Proveedore
		$scope.findOne = function() {
			$scope.proveedore = Proveedores.get({ 
				proveedoreId: $stateParams.proveedoreId
			});
		};
	}
]);