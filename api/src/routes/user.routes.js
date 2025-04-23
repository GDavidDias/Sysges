const {Router} = require('express');

const {
    validateUser,
    changePass,
    usersByArea
} = require('../controllers/usuarios.controllers');

const router = Router();

router.post('/validate', validateUser);
router.put('/changepass', changePass);
router.post('/userbyarea/:id_area', usersByArea);

module.exports = router;