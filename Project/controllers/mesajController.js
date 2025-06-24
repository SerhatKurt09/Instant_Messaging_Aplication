const Mesajlasma = require('../models/mesaj');

const mesaj_index = (req, res) => {
    Mesajlasma.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'Anasayfa', mesaj: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

const mesajlar_index = (req, res) => {
    const id = req.params.id;
    Mesajlasma.findById(id)
        .then((result) => {
            console.log(result);
            res.render('mesajlar', { mesaj: result, title: 'Detay' });
        })
        .catch((err) => console.log(err));
};
module.exports = {
    mesaj_index,
    mesajlar_index
};
