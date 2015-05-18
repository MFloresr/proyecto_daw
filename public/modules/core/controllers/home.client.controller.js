'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		var baseURL='http://lorempixel.com/1200/480/';
		
		$scope.setInterval=5000;

		$scope.slides=[
		{
			title:'Prueva slider 1',
			image:baseURL+'technics/1',
			text:'provando que el slider vaya bien'
		},
		{
			title:'Prueva slider 2',
			image:baseURL+'technics/2',
			text:'provando que el slider vaya bien segunda pagina'
		},
		{
			title:'Prueva slider 3',
			image:baseURL+'technics/3',
			text:'provando que el slider vaya bien tercera pagina'
		}
		];
	}
]);



