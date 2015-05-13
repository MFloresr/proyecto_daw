'use strict';

//Tablets service used to communicate Tablets REST endpoints
angular.module('tablets').factory('Tablets', ['$resource',
	function($resource) {
		return $resource('tablets/:tabletId', { tabletId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);