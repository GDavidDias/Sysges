const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS DOCUMENTOS CON SU ULTIMO USER DESTINO Y ULTIMO ESTADO
    try{
        
        const [result] = await pool.query(`SELECT doc.id, doc.datetime_creacion, doc.id_estado, doc.user_destino, u.nombre AS usuario_destino, doc.nota, doc.pertinente, a.descripcion AS pertinente_descripcion, doc.asunto, doc.tipodoc
            FROM (SELECT d.id, d.datetime_creacion, m.id_estado, m.user_destino, d.nota, d.pertinente, d.asunto,d.tipodoc
                FROM documento  AS d 
                LEFT JOIN (SELECT m1.id_documento, MAX(m1.id) AS max_id 
                    FROM movimientos AS m1 GROUP BY m1.id_documento) AS max_mov ON d.id = max_mov.id_documento 
                LEFT JOIN movimientos AS m ON max_mov.id_documento = m.id_documento AND max_mov.max_id = m.id 
                WHERE m.id_estado<>2) AS doc 
            LEFT JOIN usuarios as u ON doc.user_destino = u.id
            LEFT JOIN area as a ON doc.pertinente = a.id
            ORDER BY doc.datetime_creacion DESC;
                    `);
        console.log('que trae result getAllDocTotDemora: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};