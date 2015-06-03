'use strict';

//Productos service used to communicate Productos REST endpoints
angular.module('productos').factory('Productos', ['$resource',
	function($resource) {
		return $resource('productos/:productoId', { productoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('ProductosPaginate', ['$resource',
	function($resource) {
		return $resource('productos/paginate/:page/:total', { page: '@_id' , total : '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);