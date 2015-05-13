'use strict';

//Setting up route
angular.module('torres').config(['$stateProvider',
	function($stateProvider) {
		// Torres state routing
		$stateProvider.
		state('listTorres', {
			url: '/torres',
			templateUrl: 'modules/torres/views/list-torres.client.view.html'
		}).
		state('createTorre', {
			url: '/torres/create',
			templateUrl: 'modules/torres/views/create-torre.client.view.html'
		}).
		state('viewTorre', {
			url: '/torres/:torreId',
			templateUrl: 'modules/torres/views/view-torre.client.view.html'
		}).
		state('editTorre', {
			url: '/torres/:torreId/edit',
			templateUrl: 'modules/torres/views/edit-torre.client.view.html'
		});
	}
]);