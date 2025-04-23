const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    const {id_documento, user_origen, user_destino, id_area_destino, datetime_recibido, id_estado, observaciones, datetime_movimiento} = req.body;
    console.log('que ingresa por id_documento: ', id_documento);
    console.log('que ingresa por user_origen: ', user_origen);
    console.log('que ingresa por user_destino: ', user_destino);
    console.log('que ingresa por id_area_destino: ', id_area_destino);
    console.log('que ingresa por datetime_recibido: ', datetime_recibido);
    console.log('que ingresa por id_estado: ', id_estado);
    console.log('que ingresa por observaciones: ', observaciones);
    console.log('que ingresa por datetime_movimiento: ', datetime_movimiento);

    try{
        let result
        if(datetime_recibido){
            result = await pool.query(`INSERT INTO movimientos(id_documento, user_origen, user_destino, id_area_destino, datetime_recibido, id_estado, observaciones, datetime_movimiento) VALUES('${id_documento}','${user_origen}','${user_destino}','${id_area_destino}','${datetime_recibido}','${id_estado}','${observaciones}','${datetime_movimiento}');`);
        }else{
            result = await pool.query(`INSERT INTO movimientos(id_documento, user_origen, user_destino, id_area_destino, id_estado, observaciones, datetime_movimiento) VALUES('${id_documento}','${user_origen}','${user_destino}','${id_area_destino}','${id_estado}','${observaciones}','${datetime_movimiento}');`);
        }

        const[rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_movimiento');
        const id_movimiento = rows[0].id_movimiento;

        console.log(result);

        res.status(200).json({
            id_movimiento:id_movimiento,
            id_documento:id_documento,
            user_origen:user_origen,
            user_destino:user_destino,
            id_area_destino:id_area_destino,
            id_estado:id_estado,
            observaciones:observaciones,
            datetime_movimiento:datetime_movimiento
        })
    }catch(error){
        res.status(400).send(error.message);
    }
};