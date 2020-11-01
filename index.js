const express = require('express');
const session = require('express-session');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug')
app.use(session({secret: "its a secret"}));

app.use(express.static('./public'));
app.use('/app', require('./routes/app/app'));
app.use('/api', require('./routes/api/api'));

app.get('/', (req, res) => res.redirect('/app/user/login'))

app.listen(port, () => {
	console.log(`listening on ${port}`);
});
