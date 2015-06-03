'use strict';


var app= angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ProductosPaginate','Categorias',
	function($scope, Authentication, ProductosPaginate, Categorias) {

		//Hacemos una query para listar Productos
		ProductosPaginate.query({'page':1,'total':4},function(p) {
			$scope.productos = p;
		});

		//Hacemos una query para listar Productos
		Categorias.query(function(c) {
		$scope.categorias = c;
		});


		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		//slider de la pagina
		var baseURL='http://lorempixel.com/1200/460/';
		
		$scope.setInterval=5000;

		$scope.slides=[
		{
			title:'La Tegnologia al alcanse de tus manos',
			image:baseURL+'technics/1',
			text:'aqui tenemos los ultimos productos del mercado al alcance de tu mano'
		},
		{
			title:'Lo mas sencillo posible',
			image:baseURL+'technics/5',
			text:''
		},
		{
			title:'Prueva slider 3',
			image:baseURL+'technics/7',
			text:'provando que el slider vaya bien tercera pagina'
		}
		];

		// paginacion 
		/*$scope.totalItems = 64;
  		$scope.currentPage = 1;
  		$scope.maxSize = 4;
  		 $scope.bigTotalItems = 64;
  		
  		$scope.setPage = function (pageNo) {
    		$scope.currentPage = pageNo;
    		console.log($scope.currentPage);
    		ProductosPaginate.query({'page':pageNo,'total':4},function(p) {
				$scope.productos = p;
			});
  		};
  		$scope.pageNo;
  		$scope.pageChanged = function() {
		    console.log('Page changed to: ' + $scope.bigCurrentPage);
		    ProductosPaginate.query({'page':pageNo,'total':4},function(p) {
				$scope.productos = p;
			});
		  };
  		//$scope.maxSize = 5;
  		app.run(function(paginationConfig){
		paginationConfig.nextText='Siguiente';
		paginationConfig.previousText='Anterior';
		paginationConfig.lastText='Ultimo';
		paginationConfig.firstText='Primero';
		});*/
	}
]);
 


