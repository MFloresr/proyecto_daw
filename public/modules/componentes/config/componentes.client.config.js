'use strict';

// Configuring the Articles module
angular.module('componentes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Componentes', 'componentes', 'dropdown', '/componentes(/create)?');
		Menus.addSubMenuItem('topbar', 'componentes', 'List Componentes', 'componentes');
		Menus.addSubMenuItem('topbar', 'componentes', 'New Componente', 'componentes/create');
	}
]);