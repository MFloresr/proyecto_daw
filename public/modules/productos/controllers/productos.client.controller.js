'use strict';

// Productos controller
angular.module('productos').controller('ProductosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Productos', 'Categorias', 'Proveedores' ,
	function($scope, $stateParams, $location, Authentication, Productos,Categorias,Proveedores) {
		$scope.authentication = Authentication;


		//Hacemos una query para listar Categorias
		Categorias.query(function(c) {
		$scope.categorias = c;
		});

		//Hacemos una query para listar Proveedores
		Proveedores.query(function(p) {
		$scope.Proveedores = p;
		});

		// Create new Producto
		$scope.create = function() {
			// Create new Producto object
			var producto = new Productos ({
				marca: this.marca,
				modelo: this.modelo,
				categoria: this.categoria,
				proveedor: this.proveedor,
				precio: this.precio,
				url_img: this.url_img,
				descripcion: this.descripcion
				
			});

			// Redirect after save
			producto.$save(function(response) {
				$location.path('productos/' + response._id);

				// Clear form fields
				$scope.marca = '';
				$scope.modelo = '';
				$scope.proveedor = '';
				$scope.categoria = '';
				$scope.precio = '';
				$scope.url_img = '';
				$scope.descripcion = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Producto
		$scope.remove = function(producto) {
			if ( producto ) { 
				producto.$remove();

				for (var i in $scope.productos) {
					if ($scope.productos [i] === producto) {
						$scope.productos.splice(i, 1);
					}
				}
			} else {
				$scope.producto.$remove(function() {
					$location.path('productos');
				});
			}
		};

		// Update existing Producto
		$scope.update = function() {
			var producto = $scope.producto;

			producto.$update(function() {
				$location.path('productos/' + producto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Productos
		$scope.find = function() {
			$scope.productos = Productos.query();
		};

		// Find existing Producto
		$scope.findOne = function() {
			$scope.producto = Productos.get({ 
				productoId: $stateParams.productoId
			});
		};
	}
]);