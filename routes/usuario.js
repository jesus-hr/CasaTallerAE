const router = require("express").Router();
const { Usuario, validate } = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");
const isValideObject = require("../middleware/isValideObject");
const validador = require("../middleware/validate");

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

/**
 * @swagger
 * /api/usuarios/{cedula}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Actualiza los detalles de un usuario en el sistema utilizando la cédula como identificador.
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *         description: La cédula del usuario que se desea actualizar.
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
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: El ID del usuario
 *                     cedula:
 *                       type: string
 *                       description: La cédula del usuario
 *                     nombreCompleto:
 *                       type: string
 *                       description: El nombre completo del usuario
 *                     direccion:
 *                       type: string
 *                       description: La dirección del usuario
 *                     correo:
 *                       type: string
 *                       description: El correo electrónico del usuario
 *                     celular:
 *                       type: string
 *                       description: El número de celular del usuario
 *                     rol:
 *                       type: string
 *                       description: El rol del usuario (cliente o admin)
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put("/:cedula",
    [isValideObject, validador(validate)],
    asyncHandler(async (req,res)=>{
        const usuarioEditado = await Usuario.findOneAndUpdate({cedula: req.params.cedula}, req.body);
        if(!usuarioEditado){
            return res.status(404).send({ message: "Usuario no encontrado" });
        }else{
            res.status(200).send({ message: "Usuario editado", data: usuarioEditado });
        }        
    })
)

module.exports = router;