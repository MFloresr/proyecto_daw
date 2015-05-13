'use strict';

//Setting up route
angular.module('tablets').config(['$stateProvider',
	function($stateProvider) {
		// Tablets state routing
		$stateProvider.
		state('listTablets', {
			url: '/tablets',
			templateUrl: 'modules/tablets/views/list-tablets.client.view.html'
		}).
		state('createTablet', {
			url: '/tablets/create',
			templateUrl: 'modules/tablets/views/create-tablet.client.view.html'
		}).
		state('viewTablet', {
			url: '/tablets/:tabletId',
			templateUrl: 'modules/tablets/views/view-tablet.client.view.html'
		}).
		state('editTablet', {
			url: '/tablets/:tabletId/edit',
			templateUrl: 'modules/tablets/views/edit-tablet.client.view.html'
		});
	}
]);