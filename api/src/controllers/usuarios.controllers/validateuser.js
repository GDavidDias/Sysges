const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    const{username, password} = req.body;
    console.log('que viene en username: ', username);
    console.log('que viene en password: ', password);

    try{
        const [result] = await pool.query(`SELECT u.id, u.nombre, u.username, u.permiso, ua.id_area AS sector, a.descripcion AS sector_descripcion
            FROM usuarios AS u 
            LEFT JOIN usuarioarea AS ua ON u.id=ua.id_usuario
            LEFT JOIN area AS a ON ua.id_area = a.id
            WHERE u.username='${username}' AND u.password='${password}';`);

        console.log('que trae result validateuser: ', result);


        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};