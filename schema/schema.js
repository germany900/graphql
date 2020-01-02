const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLID } = graphql;

var courses = [
    { id: '1', name: "Patrones de diseño Java", language: "Java", date: "2022", professorId: '2' },
    { id: '2', name: "Programación orientada a objetos", language: "Java", date: "2022", professorId: '2' },
    { id: '3', name: "Redes y servicios", language: "Cisco", date: "2022", professorId: '3' },
    { id: '4', name: "Despliegue de aplicaciones", language: "Java", date: "2022", professorId: '5' },
    { id: '5', name: "Arquitactura de datos", language: "Java", date: "2022", professorId: '4' }
]

var professors = [
    { id: '1', name: "German", age: 22, active: true, date: 2022 },
    { id: '2', name: "Jose", age: 23, active: true, date: 2022 },
    { id: '3', name: "Miguel", age: 22, active: true, date: 2022 },
    { id: '4', name: "Sosa", age: 22, active: true, date: 2022 },
    { id: '5', name: "Angel", age: 22, active: true, date: 2022 }
]

var users = [
    { id: '1', name: "germany900", email: "ninganegro@hotmail.com", password: "german1234", date: "2025" },
    { id: '2', name: "hello", email: "hello123@hotmail.com", password: "hello123", date: "2025" },
    { id: '3', name: "ninja", email: "ninjanegro@hotmail.com", password: "hello12", date: "2025" },
    { id: '5', name: "hola", email: "hola123@hotmail.com", password: "hola123", date: "2025" }
]

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        professor: {
            type: ProfessorType,
            resolve(parent, args) {
                return professors.find(professor => professor.id === parent.professorId);
            }
        }
    })
});

const ProfessorType = new GraphQLObjectType({
    name: 'Professor',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString },
        course: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return courses.filter(course => course.professorId === parent.id);
            }

        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        date: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        course: {
            type: CourseType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return courses.find(curso => curso.id === args.id)
            }
        },
        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return courses
            }
        },
        professor: {
            type: ProfessorType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                return professors.find(professor => professor.name === args.name)
            }
        },
        professors: {
            type: new GraphQLList(ProfessorType),
            resolve(parent, args) {
                return professors
            }
        },
        user: {
            type: UserType,
            args: {
                email: { type: GraphQLString }
            },
            resolve(parent, args) {
                return users.find(user => user.email === args.email)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});