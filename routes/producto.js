const express = require('express');
const router = express.Router();
const { Producto, validate } = require('../models/producto');
const validator = require('../middleware/validate');
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Crea un nuevo producto en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProducto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: string
 *               foto:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Error en la solicitud
 *       409:
 *         description: Producto ya existe
 * 
 *     tags:
 *       - Producto
 */
router.post("/",
    validator(validate),
    asyncHandler(async (req, res) => {
        //buscar si ya existe un producto
        const productoExiste = await Producto.findOne({
            idProducto: req.body.idProducto,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            foto: req.body.foto,
            categoria: req.body.categoria
        });

        if(productoExiste){
            //si ya existe, incrementa cantidad del producto
            productoExiste.cantidad++;
            await productoExiste.save();
            return res.status(200).send("Cantidad disponible actualizada");
        }else{
            //si no existe, crea uno nuevo
            const nuevoProducto = await Producto(req.body).save();
            nuevoProducto.cantidad++;
            await nuevoProducto.save();
            return res.status(200).send("Producto creado con éxito");
        }
    })
);
module.exports = router;