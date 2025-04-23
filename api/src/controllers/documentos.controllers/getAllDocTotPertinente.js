const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS DOCUMENTOS Totalizados por Pertinente
    try{
        const [result] = await pool.query(`SELECT COUNT(d.id) AS cantidad, d.pertinente AS id_pertinente, a.descripcion AS pertinente
            FROM documento AS d 
            LEFT JOIN area AS a ON d.pertinente = a.id
            GROUP BY d.pertinente`);

        //console.log('que trae result getAllDocTotPertinente: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};