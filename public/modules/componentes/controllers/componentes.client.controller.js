'use strict';

// Componentes controller
angular.module('componentes').controller('ComponentesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Componentes',
	function($scope, $stateParams, $location, Authentication, Componentes) {
		$scope.authentication = Authentication;

		// Create new Componente
		$scope.create = function() {
			// Create new Componente object
			var componente = new Componentes ({
				marca: this.marca,
				modelo: this.modelo,
				nserie: this.nserie,
				precio: this.precio,
				url_img: this.url_img,
				descripcion: this.descripcion
			});

			// Redirect after save
			componente.$save(function(response) {
				$location.path('componentes/' + response._id);

				// Clear form fields
				$scope.marca = '';
				$scope.modelo = '';
				$scope.nserie = '';
				$scope.precio = '';
				$scope.url_img = '';
				$scope.descripcion = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Componente
		$scope.remove = function(componente) {
			if ( componente ) {
				componente.$remove();

				for (var i in $scope.componentes) {
					if ($scope.componentes [i] === componente) {
						$scope.componentes.splice(i, 1);
					}
				}
			} else {
				$scope.componente.$remove(function() {
					$location.path('componentes');
				});
			}
		};

		// Update existing Componente
		$scope.update = function() {
			var componente = $scope.componente;

			componente.$update(function() {
				$location.path('componentes/' + componente._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Componentes
		$scope.find = function() {
			$scope.componentes = Componentes.query();
		};

		// Find existing Componente
		$scope.findOne = function() {
			$scope.componente = Componentes.get({
				componenteId: $stateParams.componenteId
			});
		};
	}
]);
