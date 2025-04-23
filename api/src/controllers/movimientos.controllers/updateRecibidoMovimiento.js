const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    const {id_movimiento, datetime_recibido} = req.body;
    console.log('que ingresa por id_movimiento: ', id_movimiento);
    console.log('que ingresa por datetime_recibido: ', datetime_recibido);

    try{
        const result = await pool.query(`UPDATE movimientos SET datetime_recibido='${datetime_recibido}' WHERE id='${id_movimiento}';`);

        console.log(result);

        res.status(200).json({
            message:"datetime_recibido actualizado en movimiento",
            id_movimiento:id_movimiento,
            datetime_recibido:datetime_recibido
        })
    }catch(error){
        res.status(400).send(error.message);
    }
};