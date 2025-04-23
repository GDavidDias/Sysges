const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    const{id_area} = req.params;

    try{
        const [result] = await pool.query(`SELECT ua.id, ua.id_usuario, u.nombre, ua.id_area, u.activo
            FROM usuarioarea AS ua
            LEFT JOIN usuarios as u ON ua.id_usuario = u.id
            WHERE ua.id_area = '${id_area}' AND u.activo IS NOT NULL`);

        console.log('que trae result getusersByArea: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};