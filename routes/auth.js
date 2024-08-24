const router = require("express").Router();
const { Usuario } = require("../models/usuario");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", 
	async (req, res) =>
	{
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await Usuario.findOne({ correo: req.body.correo });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });
		
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.contrasena
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "Inicio Sesion Exitoso" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		correo: Joi.string().email().required().label("Correo"),
		contrasena: Joi.string().required().label("Clave"),
	});
	return schema.validate(data);
};

module.exports = router;