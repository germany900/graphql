const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const app = express();
const schema = require('./schema/schema');
const auth = require('./utlis/auth');

mongoose.connect('mongodb://localhost/coursedb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB corriendo en el puerto 27017'))
    .catch(() => console.log('Error al conectarce a la DB'));

app.use(
    auth.checkHeaders
)

app.use('/graphql', graphqlHTTP((req) => {
    return {
        schema,
        context: {
            user: req.user
        }
    }
}));

app.listen(3002, () => {
    console.log('El servidor esta corriendo en el puerto: 3002');
});