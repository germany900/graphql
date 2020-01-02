const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schema/schema');


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(3002, () => {
    console.log('El servidor esta corriendo en el puerto: 3002');
});