const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS DOCUMENTOS CON SU ULTIMO USER DESTINO Y ULTIMO ESTADO
    try{
        const [result] = await pool.query(`SELECT d.id, d.datetime_creacion, d.nota, d.pertinente AS idPertinente, a.descripcion AS pertinente, d.asunto, m.id_estado, e.descripcion AS estado, m.id AS ordenmov, m.datetime_recibido, m.user_destino, u.nombre, d.tipodoc, d.origen, d.fojas
            FROM documento AS d 
            LEFT JOIN (SELECT m1.id_documento, MAX(m1.id) AS max_id FROM movimientos AS m1 GROUP BY m1.id_documento) AS max_mov
            ON d.id = max_mov.id_documento 
            LEFT JOIN movimientos AS m ON max_mov.id_documento = m.id_documento AND max_mov.max_id = m.id 
            LEFT JOIN area AS a ON d.pertinente = a.id 
            LEFT JOIN estados AS e ON m.id_estado = e.id 
            LEFT JOIN usuarios AS u ON m.user_destino = u.id 
            ORDER BY d.datetime_creacion DESC`);

        console.log('que trae result getAlldocumentos: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};