const router = require("express").Router();
const { Usuario, validate } = require("../models/usuario");
const bcrypt = require("bcrypt");

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

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.contrasena, salt);

        await new Usuario({ ...req.body, contrasena: hashPassword }).save();
        res.status(201).send({ message: "Usuario Creado Correctamente" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;