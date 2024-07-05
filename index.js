const express = require(`express`);
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));