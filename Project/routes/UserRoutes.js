const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.get('/kullanicilar', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('kullanicilar', { users, title: 'Kullanıcılar' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = router;
