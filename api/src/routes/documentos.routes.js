const {Router} = require('express');

const {
    createDocumento,
    getdocumentosByUser,
    getAlldocumentos,
    getDocumentHistoricByUser,
    getAllDocTotalizados,
    getAllDocTotPertinente,
    getDocumentHistoricBySector,
    getAllDocTotDemora,
    updateDocumento
} = require('../controllers/documentos.controllers');

const router = Router();

router.post('/newdocumento',createDocumento);
router.post('/documentosbyuser/:user_destino', getdocumentosByUser);
router.get('/alldocumentos', getAlldocumentos);
router.post('/historicdocuser/:user_destino', getDocumentHistoricByUser);
router.get('/alldoctotalizados',getAllDocTotalizados);
router.get('/alldoctotpertinente', getAllDocTotPertinente);
router.post('/historicdocarea/:id_area_destino', getDocumentHistoricBySector);
router.get('/alldoctotdemora', getAllDocTotDemora);
router.put('/updatedocumento', updateDocumento);

module.exports = router;