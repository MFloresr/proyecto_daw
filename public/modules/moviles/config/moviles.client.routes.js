'use strict';

//Setting up route
angular.module('moviles').config(['$stateProvider',
	function($stateProvider) {
		// Moviles state routing
		$stateProvider.
		state('listMoviles', {
			url: '/moviles',
			templateUrl: 'modules/moviles/views/list-moviles.client.view.html'
		}).
		state('createMovile', {
			url: '/moviles/create',
			templateUrl: 'modules/moviles/views/create-movile.client.view.html'
		}).
		state('viewMovile', {
			url: '/moviles/:movileId',
			templateUrl: 'modules/moviles/views/view-movile.client.view.html'
		}).
		state('editMovile', {
			url: '/moviles/:movileId/edit',
			templateUrl: 'modules/moviles/views/edit-movile.client.view.html'
		});
	}
]);