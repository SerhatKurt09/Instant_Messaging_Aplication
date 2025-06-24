//1Gerekli modüllerin içe aktarılması
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const AdminRoutes = require('./routes/AdminRoutes');
const mesajlarRoutes = require('./routes/mesajlarRoutes');
const AutRoutes = require('./routes/AutRoutes');
const User = require('./models/users');
const { requireAuth } = require('./middlewares/autMiddleware');

//2Uygulama portu ve sunucu tanımlamaları
const port = process.env.PORT || 1250;
const app = express();
const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: 'http://localhost:1250',
        methods: ['GET', 'POST'],
    },
});
const isAuthenticated = (req, res, next) => {
    console.log('Session:', req.session);
    if (req.session && req.session.isAuthenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
};


// MongoDB bağlantısı
const dbURL = 'mongodb+srv://emodogge213:Emirhan926@cluster0.pardpac.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURL, {})
    .then(() => {
        server.listen(port, () => {
            console.log(`MongoDB bağlantısı başarıyla kuruldu ve uygulama ${port} portunda dinleniyor.`);
        });
    })
    .catch((err) => console.error('MongoDB bağlantısı sırasında bir hata oluştu:', err));


    //3Express Middleware'leri
app.use(cors());
app.use(express.static('public'));
app.use('/models', express.static('models'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());    
app.use(session({
        secret: 'gizli kelime',
        resave: true,
        saveUninitialized: true
    }));


//4Middleware: Oturum kontrolü    
app.use((req, res, next) => {
        console.log('Session:', req.session);
        next();
    });
    

//5View motoru ve rota tanımlamaları    
app.set('view engine', 'ejs');
app.use('/admin', AdminRoutes);
app.use('/admin', AutRoutes);
app.use('/mesajlar', mesajlarRoutes);
app.use(AutRoutes);


// Ana sayfa yönlendirmeleri
app.get('/', (req, res) => {
    console.log('Session:', req.session);
    if (req.session.isAuthenticated) {
        res.redirect('/guvenliindex');
    } 
    else {
        res.redirect('/mesajlar');
    }
});

// Güvenli index sayfası ve kimlik doğrulama kontrolü
app.get('/guvenliindex',  (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('guvenliindex', { title: 'Güvenli Anasayfa' });
    } 
    else {
        console.log("giriş sayfasına yönlendirildi.")
        res.redirect('/login');
    }
});


// Güvenli about sayfası ve kimlik doğrulama kontrolü
app.get('/guvenliabout', (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('guvenliabout', { title: 'Hakkımızda' });
    }
    else {
        res.redirect('/');
    }
});


// Kullanıcı index sayfası
app.get('/kullaniciindex', async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            console.error('No users found');
            return res.status(404).send('No users found');
        }

        console.log('Users:', users);
        res.render('kullaniciindex', { title: 'Chat', users });
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Diğer sayfa rotaları
app.get('/about', (req, res) => {
    res.render('about', { title: 'Hakkımızda' });
});

app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Kayıt Ol' });
});



// Socket.io ile WebSocket işlemleri
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // İlk bağlantıda kullanıcı listesini yayınla
    io.emit('userList', Object.keys(io.sockets.sockets));

    // Chat olayı
    socket.on('chat', (data) => {
        console.log('Chat event received:', data);
        io.sockets.emit('chat', data); 
    });


     // Yazma durumu olayı
    socket.on('typing', (data) => {
        console.log('Typing event received:', data);
        socket.broadcast.emit('typing', data);
    });



    // Bağlantı kopması olayı
    socket.on('disconnect', () => {
        io.emit('userList', Object.keys(io.sockets.sockets));
        console.log(`Socket disconnected: ${socket.id}`);
    });
});



// 404 durumunda sayfa bulunamadı hatası
app.use(cors());
app.use((req, res) => {
    res.status(404).render('404', { title: 'Sayfa Bulunamadı' });
});
