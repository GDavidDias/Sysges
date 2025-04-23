const mysql = require('mysql2/promise');

const dbSettingsLocal = {
    host:'localhost',
    user:'root',
    password: 'Admin.456',
    port: 3306,
    database: 'dbgesdoc'
};

const dbSettingsRemoto = {
    host:'localhost',
    user:'ikmofbxm_admin',
    password: 'Pancho.345',
    database: 'ikmofbxm_dbgesdoc',
    timezone: 'local'
}

const pool = mysql.createPool(dbSettingsLocal);

module.exports = pool;
