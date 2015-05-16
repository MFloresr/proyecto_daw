'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
	marca: {
		type: String,
		default: '',
		required: 'por favor introdusca una marca',
		trim: true
	},
  	modelo: {
		type: String,
		default: '',
		required: 'Por favor introdusca un modelo',
		trim: true
	},
	categoria: {
		//type: mongoose.Schema.Types.ObjectId,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Categoria'
	},
  	precio: {
		type: String,
		default: '',
		required: 'Por favor introdusca un precio',
		trim: true
	},
	proveedor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Proveedore'
	},
  	url_img: {
		type: String,
		default: '',
		required: 'Por favor introdusca una URL',
		trim: true
	},
	descripcion: {
		type: String,
		default: '',
		required: 'Por favor introdusca una descripcion',
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

mongoose.model('Producto', ProductoSchema);