const mongoose = require("mongoose");

/**
 * Middleware para validar el formato de la cédula
 */
module.exports = (req, res, next) => {
    // Aquí se asume que la cédula debe ser una cadena alfanumérica de longitud específica (ajusta según tu caso)
    const cedula = req.params.cedula;

    // Ejemplo de validación simple: la cédula debe tener entre 6 y 20 caracteres alfanuméricos
    const cedulaRegex = /^[a-zA-Z0-9]{1,10}$/;

    if (!cedulaRegex.test(cedula)) {
        return res.status(400).send({ message: "Cédula inválida" });
    }

    next();
};
