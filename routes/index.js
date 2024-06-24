const {Router} = require('express');
const router = Router();

const {getNombre, getTrue, getProductosTipo, createArriendo, updateArriendo, insertDispositivo, deleteCarrito, comprarCarrito, deleteArriendo, createProducto, deleteProducto, getProductosCliente} = require('../controller/index.controller')

router.get('/Nombre', getNombre);
router.get('/True', getTrue);
router.get('/ProductosByCliente', getProductosCliente);
router.post('/CreateArriendo', createArriendo);
router.post('/ExtenderArriendo', updateArriendo);
router.post('/Insert', insertDispositivo);
router.post('/DeleteCarrito', deleteCarrito);
router.post('/ComprarCarrito', comprarCarrito);
router.post('/TerminarArriendo', deleteArriendo);
router.post('/CreareProducto', createProducto);
router.post('/DeleteProducto', deleteProducto);

module.exports = router;