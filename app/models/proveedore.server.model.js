'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Proveedore Schema
 */
var ProveedoreSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Por favor introdusca un nombre',
		trim: true
	},
	telefono: {
		type: String,
		default: '',
		required: 'Por favor introdusca un telefono',
		trim: true
	},
	correo: {
		type: String,
		default: '',
		required: 'Por favor introdusca un correo',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Proveedore', ProveedoreSchema);