const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const dotenv = require('dotenv');
dotenv.config();
const { MONGO_DB_USER_USERNAME, MONGO_DB_USER_PASSWORD,
    MONGO_DB_HOST, MONGO_DB_DB } = process.env;

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo_connect_str = `mongodb+srv://${MONGO_DB_USER_USERNAME}:`
    +`${MONGO_DB_USER_PASSWORD}@${MONGO_DB_HOST}/${MONGO_DB_DB}`
    +'?retryWrites=true&w=majority';
db.mongoose.connect(mongo_connect_str, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('Successfuly connected to MongoDB'))
.catch(err=>{
    console.error('Connection error', err);
    process.exit();
});

require('./routes/auth.routes')(app);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
