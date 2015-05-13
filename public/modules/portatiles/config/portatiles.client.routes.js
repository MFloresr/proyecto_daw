'use strict';

//Setting up route
angular.module('portatiles').config(['$stateProvider',
	function($stateProvider) {
		// Portatiles state routing
		$stateProvider.
		state('listPortatiles', {
			url: '/portatiles',
			templateUrl: 'modules/portatiles/views/list-portatiles.client.view.html'
		}).
		state('createPortatile', {
			url: '/portatiles/create',
			templateUrl: 'modules/portatiles/views/create-portatile.client.view.html'
		}).
		state('viewPortatile', {
			url: '/portatiles/:portatileId',
			templateUrl: 'modules/portatiles/views/view-portatile.client.view.html'
		}).
		state('editPortatile', {
			url: '/portatiles/:portatileId/edit',
			templateUrl: 'modules/portatiles/views/edit-portatile.client.view.html'
		});
	}
]);