const User = require('../models/users');
const jwt = require('jsonwebtoken');

const maxAge = 60 * 60 * 24;
const createToken = (id) => {
    return jwt.sign({ id }, 'gizli kelime', { expiresIn: maxAge });
}

const login_get = (req, res) => {
    res.render('login', { title: 'Giriş Yap' });
}

const login_post = async (req, res) => {
    try {
        const user = await User.authenticate(req.body.username, req.body.password);
        if (user) {
            req.session.isAuthenticated = true;
            req.session.user = user;
            if (user.isAdmin) {
                res.redirect('/admin');
            } else {
                res.redirect('/kullaniciindex');
            }
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Giriş başarısız. Bir hata oluştu.");
    }
};

const signup_get = (req, res) => {
    res.render('signup', { title: 'Kayıt Ol' });
};

const signup_post = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send("Kayıt başarısız. Bir hata oluştu.");
    }
};

const logout_get = (req, res) => {
    req.session.isAuthenticated = false;
    res.redirect('/');
};

const guvenliindex_get = (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('guvenliindex', { title: 'Güvenli Anasayfa' });
    } else {
        res.redirect('/login');
    }
};

const guvenliabout_get = (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('guvenliabout', { title: 'Güvenli Hakkımızda' });
    } else {
        res.redirect('/login');
    }
};

const admin_get = (req, res) => {
    if (req.session.user) {
        res.render('admin', { title: 'Admin Sayfası' });
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    login_get,
    login_post,
    signup_get,
    signup_post,
    logout_get,
    guvenliindex_get,
    guvenliabout_get,
    admin_get
};
