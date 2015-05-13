'use strict';

//Torres service used to communicate Torres REST endpoints
angular.module('torres').factory('Torres', ['$resource',
	function($resource) {
		return $resource('torres/:torreId', { torreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);