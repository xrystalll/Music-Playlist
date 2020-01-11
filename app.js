const express = require('express');
const app = express();
const server = require('http').createServer(app);

server.listen(process.env.PORT || 8080, () => console.info('Server started')),

app.set('view engine', 'ejs'),
app.use(express.static('public')),

app.get('/', (req, res) => {
    res.render('index')
});
