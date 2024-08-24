const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    cedula : { type: String, required: true },
	nombreCompleto: { type: String, required: true },
	direccion: { type: String, required: true },
	correo: { type: String, required: true },
	contrasena: { type: String, required: true },
    celular : { type: String, required: true },
    rol : { type: String, required: true }
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const Usuario = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
        cedula: Joi.string().required().label("Cedula"),
		nombreCompleto: Joi.string().required().label("Nombre Completo"),
		direccion: Joi.string().required().label("Direccion"),		
		correo: Joi.string().email().required().label("Correo"),
		contrasena: passwordComplexity().required().label("Clave"),
        celular: Joi.string().required().label("Celular"),
        rol: Joi.string().required().label("Rol"),
	});
	return schema.validate(data);
};

module.exports = { Usuario, validate };