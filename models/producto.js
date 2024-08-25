const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    idProducto : { type: String, required: true },
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	precio: { type: Number, required: true },
	foto: { type: String, required: true }
});

const Producto = mongoose.model("producto", userSchema);

const validate = (data) => {
	const schema = Joi.object({
        idProducto: Joi.string().required().label("Identificador"),
        nombre: Joi.string().required().label("Nombre"),
        descripcion: Joi.string().required().label("Descripcion"),
        precio: Joi.number().required().label("Precio"),
        foto: Joi.string().required().label("Foto"),
	});
	return schema.validate(data);
};

module.exports = { Producto, validate };