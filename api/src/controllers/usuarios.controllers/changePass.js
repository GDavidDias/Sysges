const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    const{username, password, newpassword} = req.body;
    console.log('que viene en username: ', username);
    console.log('que viene en password: ', password);
    console.log('que viene en password: ', newpassword);

    try{
        const [result] = await pool.query(`UPDATE usuarios SET password='${newpassword}' WHERE username='${username}';`);

        console.log('que trae result validateuser: ', result);


        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};