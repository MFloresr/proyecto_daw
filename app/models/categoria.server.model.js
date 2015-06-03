'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Categoria Schema
 */
var CategoriaSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Por favor introdusca un Nombre',
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

mongoose.model('Categoria', CategoriaSchema);