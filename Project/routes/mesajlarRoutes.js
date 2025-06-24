const express = require('express');
const router = express.Router();
const mesajController = require('../controllers/mesajController');
router.get('/guvenliindex',mesajController.mesaj_index)
router.get('/guvenliindex:id',mesajController.mesajlar_index)
router.get('/', mesajController.mesaj_index);
router.get('/:id', mesajController.mesajlar_index);

module.exports = router;