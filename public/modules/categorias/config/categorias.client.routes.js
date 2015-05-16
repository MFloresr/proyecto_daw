'use strict';

//Setting up route
angular.module('categorias').config(['$stateProvider',
	function($stateProvider) {
		// Categorias state routing
		$stateProvider.
		state('listCategorias', {
			url: '/categorias',
			templateUrl: 'modules/categorias/views/list-categorias.client.view.html'
		}).
		state('createCategoria', {
			url: '/categorias/create',
			templateUrl: 'modules/categorias/views/create-categoria.client.view.html'
		}).
		state('viewCategoria', {
			url: '/categorias/:categoriaId',
			templateUrl: 'modules/categorias/views/view-categoria.client.view.html'
		}).
		state('editCategoria', {
			url: '/categorias/:categoriaId/edit',
			templateUrl: 'modules/categorias/views/edit-categoria.client.view.html'
		});
	}
]);