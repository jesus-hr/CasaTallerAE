const router = require("express").Router();
const { Usuario, validate } = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");

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

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Obtiene una lista de todos los usuarios en el sistema.
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: El ID del usuario
 *                   cedula:
 *                     type: string
 *                     description: La cédula del usuario
 *                   nombreCompleto:
 *                     type: string
 *                     description: El nombre completo del usuario
 *                   direccion:
 *                     type: string
 *                     description: La dirección del usuario
 *                   correo:
 *                     type: string
 *                     description: El correo electrónico del usuario
 *                   celular:
 *                     type: string
 *                     description: El número de celular del usuario
 *                   rol:
 *                     type: string
 *                     description: El rol del usuario (cliente o admin)
 *       500:
 *         description: Error en el servidor
 */
router.get("/",
    asyncHandler(async (req,res)=>{
        const usuario = await Usuario.find();
        res.send(usuario);
    })
)

module.exports = router;