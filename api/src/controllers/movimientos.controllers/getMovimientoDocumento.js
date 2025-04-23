const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    const{id_documento} = req.params;

    try{
        const [result] = await pool.query(`SELECT m.id AS id_movimiento, m.id_documento, m.datetime_movimiento, m.user_origen, u.nombre AS usuario_origen, m.user_destino, u2.nombre AS usuario_destino,  m.datetime_recibido, m.id_estado, e.descripcion AS estado, m.observaciones  
            FROM movimientos AS m 
            LEFT JOIN usuarios AS u ON m.user_origen = u.id 
            LEFT JOIN usuarios AS u2 ON m.user_destino = u2.id
            LEFT JOIN estados AS e ON m.id_estado = e.id
            WHERE id_documento='${id_documento}'
            ORDER BY m.id DESC`);

        console.log('que trae result getMovimientoDocumento/:id_documento: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};