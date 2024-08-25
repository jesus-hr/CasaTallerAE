const router = require("express").Router();
const { Usuario, validate } = require("../models/usuario");
const bcryptjs = require("bcryptjs");

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               direccion:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               celular:
 *                 type: string
 *               rol: 
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error en la solicitud
 *       409:
 *         description: Usuario con el email ya existe
 */
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await Usuario.findOne({ correo: req.body.correo });
        if (user)
            return res
                .status(409)
                .send({ message: "Usuario con ese email ya existe!" });

        const salt = await bcryptjs.genSalt(Number(process.env.SALT));
        const hashPassword = await bcryptjs.hash(req.body.contrasena, salt);

        await new Usuario({ ...req.body, contrasena: hashPassword }).save();
        res.status(201).send({ message: "Usuario Creado Correctamente" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;