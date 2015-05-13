'use strict';

//Portatiles service used to communicate Portatiles REST endpoints
angular.module('portatiles').factory('Portatiles', ['$resource',
	function($resource) {
		return $resource('portatiles/:portatileId', { portatileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);