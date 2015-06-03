'use strict';

// Configuring the Articles module
angular.module('categorias').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categorias', 'categorias', 'dropdown', '/categorias(/create)?');
		Menus.addSubMenuItem('topbar', 'categorias', 'Lista de Categorias', 'categorias');
		Menus.addSubMenuItem('topbar', 'categorias', 'Nueva Categoria', 'categorias/create');
	}
]);