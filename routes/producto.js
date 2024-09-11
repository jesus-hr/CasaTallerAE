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

        if (productoExiste) {
            //si ya existe, incrementa cantidad del producto
            productoExiste.cantidad++;
            await productoExiste.save();
            return res.status(200).send("Cantidad disponible actualizada");
        } else {
            //si no existe, crea uno nuevo
            const nuevoProducto = await Producto(req.body).save();
            nuevoProducto.cantidad++;
            await nuevoProducto.save();
            return res.status(200).send("Producto creado con éxito");
        }
    })
);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Devuelve una lista de todos los productos en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idProducto:
 *                     type: string
 *                     description: Identificador del producto
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del producto
 *                   precio:
 *                     type: string
 *                     description: Precio del producto
 *                   foto:
 *                     type: string
 *                     description: URL de la foto del producto
 *                   cantidad:
 *                     type: integer
 *                     description: Cantidad en stock
 *                   categoria:
 *                     type: string
 *                     description: Categoría del producto
 *       500:
 *         description: Error en el servidor
 * 
 * 
 *     tags:
 *          - Producto
 */
router.get("/",
    asyncHandler(async (req, res) => {
        const productos = await Producto.find();
        res.send(productos);
    })
)

/**
 * @swagger
 * /api/productos/{idProducto}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Devuelve un producto específico basado en su identificador único.
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: string
 *         description: El identificador único del producto que se desea obtener.
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idProducto:
 *                   type: string
 *                   description: Identificador del producto
 *                 nombre:
 *                   type: string
 *                   description: Nombre del producto
 *                 descripcion:
 *                   type: string
 *                   description: Descripción del producto
 *                 precio:
 *                   type: string
 *                   description: Precio del producto
 *                 foto:
 *                   type: string
 *                   description: URL de la foto del producto
 *                 cantidad:
 *                   type: integer
 *                   description: Cantidad en stock
 *                 categoria:
 *                   type: string
 *                   description: Categoría del producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 * 
 * 
 *     tags:
 *          - Producto
 */
router.get("/:idProducto",
    asyncHandler(async (req, res) => {
        const producto = await Producto.findOne({ idProducto: req.params.idProducto }, req.body);
        if (!producto) {
            return res.status(404).send({ message: "Producto no encontrado" });
        } else {
            res.send(producto);
        }
    })
)

/*
 * @swagger
 * /productos/categoria/{categoria}:
 *   get:
 *     summary: Obtener productos por categoría
 *     description: Devuelve una lista de productos que pertenecen a una categoría específica.
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: La categoría de los productos que se desean obtener.
 *     responses:
 *       200:
 *         description: Lista de productos en la categoría especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idProducto:
 *                     type: string
 *                     description: Identificador del producto
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del producto
 *                   precio:
 *                     type: string
 *                     description: Precio del producto
 *                   foto:
 *                     type: string
 *                     description: URL de la foto del producto
 *                   cantidad:
 *                     type: integer
 *                     description: Cantidad en stock
 *                   categoria:
 *                     type: string
 *                     description: Categoría del producto
 *       404:
 *         description: No se encontraron productos para la categoría especificada
 *       500:
 *         description: Error en el servidor
 * 
 * 
 *     tags:
 *          - Producto
 */
/* router.get("/categoria/:categoria",
    asyncHandler(async (req, res) => {
        const productoPorCategoria = await Producto.find({ categoria: req.params.categoria }, req.body);
        if (!productoPorCategoria) {
            return res.status(404).send({ message: "Producto no sdsencontrado" });
        } else {
            res.send(productoPorCategoria);
        }
    })
) */

/**
 * @swagger
 * /api/productos/{idProducto}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     description: Elimina un producto específico basado en su identificador único.
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: string
 *         description: El identificador único del producto que se desea eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 * 
 *     tags:
 *          - Producto
 */
router.delete("/:idProducto",
    asyncHandler(async (req, res) => {
        const { idProducto } = req.params;
        const producto = await Producto.findOne({ idProducto });
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        await Producto.findOneAndDelete({ idProducto });
        return res.status(200).send("Producto eliminado");
    })
)
module.exports = router;