const Mesajlasma = require('../models/mesaj')

const admin_index = (req, res) => {
    Mesajlasma.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('admin', { title: 'Admin', mesajlar: result });
        })
        .catch((err) => {
            console.log(err);
        });
}

const admin_add =(req,res)=>{
    res.render('ekle',{title:'Yeni yazı'})
}

const admin_add_post =(req,res)=>{
    const mesaj = new Mesajlasma(req.body);

    mesaj.save()
        .then((result)=>{
            res.redirect('/admin')
        })
        .catch((err)=>{
            console.log(err)
        })
}

const admin_delete=(req, res) => {
    const id = req.params.id;
    Mesajlasma.findByIdAndDelete(id)
        .then((result) => {
            res.json({ link: '/admin' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Silme işlemi sırasında bir hata oluştu' });
        });
}

module.exports ={
    admin_index,
    admin_add,
    admin_add_post,
    admin_delete
}