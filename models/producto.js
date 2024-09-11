const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    idProducto : { type: String, required: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	precio: { type: String, required: true },
	foto: { type: String, required: true },
	cantidad: { type: Number, default:0 },
	categoria: { type: String, required: true}
});

const Producto = mongoose.model("producto", userSchema);

const validate = (data) => {
	const schema = Joi.object({
        idProducto: Joi.string().required().label("Identificador"),
        nombre: Joi.string().required().label("Nombre"),
        descripcion: Joi.string().required().label("Descripcion"),
        precio: Joi.string().required().label("Precio"),
        foto: Joi.string().required().label("Foto"),
		cantidad: Joi.number().required().label("Cantidad"),
		categoria: Joi.string().required().label("Categoria")
	});
	return schema.validate(data);
};

module.exports = { Producto, validate };