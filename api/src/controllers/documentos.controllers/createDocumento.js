const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    const {datetime_creacion, nota, pertinente, asunto, tipodoc, origen, fojas} = req.body;
    console.log('que trae datetime_creacion: ', datetime_creacion);
    console.log('que trae nota: ', nota);
    console.log('que trae pertinente: ', pertinente);
    console.log('que trae asunto: ', asunto);
    console.log('que trae tipodoc: ', tipodoc);
    console.log('que trae origen: ', origen);
    console.log('que trae fojas: ', fojas);

    try{
        const result = await pool.query(`INSERT INTO documento(datetime_creacion, nota, pertinente, asunto, tipodoc, origen, fojas) VALUES ('${datetime_creacion}','${nota}','${pertinente}','${asunto}','${tipodoc}', '${origen}', '${fojas}');`);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_documento');
        const id_documento = rows[0].id_documento;

        console.log(result);

        res.status(200).json({
            id_documento:id_documento,
            datetime_creacion:datetime_creacion,
            nota:nota,
            pertinente:pertinente,
            asunto:asunto,
            tipodoc:tipodoc,
            origen:origen, 
            fojas:fojas
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};