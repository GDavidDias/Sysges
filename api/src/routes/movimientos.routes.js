const {Router} = require('express');

const {
    createMovimiento,
    getMovimientoDocumento,
    updateRecibidoMovimiento
}=require('../controllers/movimientos.controllers');

const router = Router();

router.post('/newmovimiento', createMovimiento);
router.post('/movimientos/:id_documento',getMovimientoDocumento);
router.put('/updfechamov',updateRecibidoMovimiento);

module.exports=router;