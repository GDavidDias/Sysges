const createDocumento = require('./createDocumento.js');
const getdocumentosByUser = require('./getDocumentosByUser.js');
const getAlldocumentos = require('./getAllDocumentos.js');
const getDocumentHistoricByUser = require('./getDocumentHistoricByUser.js');
const getAllDocTotalizados = require('./getAllDocTotalizados.js');
const getAllDocTotPertinente = require('./getAllDocTotPertinente.js');
const getDocumentHistoricBySector = require('./getDocumentHistoricBySector.js');
const getAllDocTotDemora = require('./getAllDocTotDemora.js');
const updateDocumento = require('./updateDocumento.js');

module.exports={
    createDocumento,
    getdocumentosByUser,
    getAlldocumentos,
    getDocumentHistoricByUser,
    getAllDocTotalizados,
    getAllDocTotPertinente,
    getDocumentHistoricBySector,
    getAllDocTotDemora,
    updateDocumento
};