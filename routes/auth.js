const router = require("express").Router();
const { Usuario } = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const Joi = require("joi");

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Autenticación de usuario
 *     description: Autenticación de usuario con correo electrónico y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario.
 *             required:
 *               - correo
 *               - contrasena
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Token JWT generado.
 *                 message:
 *                   type: string
 *                   example: "Inicio Sesión Exitoso"
 *       400:
 *         description: Error en la solicitud. Validación fallida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       401:
 *         description: Correo o clave inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 * 
 *     tags:
 *       - UsuariosAuth
 */
router.post("/",
	async (req, res) => {
		try {
			const { error } = validate(req.body);
			if (error)
				return res.status(400).send({ message: error.details[0].message });

			const user = await Usuario.findOne({ correo: req.body.correo });
			if (!user)
				return res.status(401).send({ message: "Correo o clave inválidos" });

			const validPassword = await bcryptjs.compare(
				req.body.contrasena,
				user.contrasena
			);
			if (!validPassword)
				return res.status(401).send({ message: "Correo o clave inválidos" });

			//const token = user.generateAuthToken();
			res.status(200).send({ /* data: token,  */message: "Inicio Sesion Exitoso" });
		} catch (error) {
			console.error(error);
			res.status(500).send({ message: "Internal Server Error", error: error.message });
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