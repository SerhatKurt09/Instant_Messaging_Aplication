const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/',adminController.admin_index)
router.get('/ekle',adminController.admin_add)
router.post('/ekle',adminController.admin_add_post)
router.delete('/delete/:id',adminController.admin_delete);

module.exports = router

