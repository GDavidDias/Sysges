const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    const {id, nota, idPertinente, asunto, origen, fojas} = req.body;
    console.log('que ingresa por id: ', id);
    console.log('que ingresa por nota: ', nota);
    console.log('que ingresa por idPertinente: ', idPertinente);
    console.log('que ingresa por asunto: ', asunto);
    console.log('que ingresa por origen: ', origen);
    console.log('que ingresa por fojas: ', fojas);

    try{
        const result = await pool.query(`UPDATE documento SET nota='${nota}', pertinente=${idPertinente}, asunto='${asunto}', origen='${origen}', fojas='${fojas}' WHERE id='${id}';`);

        console.log(result);

        res.status(200).json({
            message:"documento actualizado",
            id:id,
            nota:nota,
            idPertinente:idPertinente,
            asunto:asunto,
            origen:origen,
            fojas:fojas
        })
    }catch(error){
        res.status(400).send(error.message);
    }
};