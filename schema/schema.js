const graphql = require('graphql');
const Course = require('../models/course');
const Professor = require('../models/professor');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLID } = graphql;

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
                return Professor.findById(parent.professorId); //Una forma de buscar por ID en la base de datos
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
                return Course.find({ professorId: parent.id }); // Segunda forma de busqueda por ID pero con una valor marcado
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
        //Obtener curso por id
        course: {
            type: CourseType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Course.findById(args.id);
            }
        },
        //Obtener todos los cursos
        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args) {
                return Course.find();
            }
        },
        //obtener los profesores por nombre
        professor: {
            type: ProfessorType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Professor.findOne({ name: args.name });
            }
        },
        //Obtener todos los profesores
        professors: {
            type: new GraphQLList(ProfessorType),
            resolve(parent, args) {
                return Professor.find();
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
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Agregar Curso
        addCourse: {
            type: CourseType,
            args: {
                name: { type: GraphQLString },
                language: { type: GraphQLString },
                date: { type: GraphQLString },
                professorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let course = new Course({
                    name: args.name,
                    language: args.language,
                    date: args.date,
                    professorId: args.professorId
                })
                return course.save()
            }
        },
        //Actualizar Curso
        updateCourse: {
            type: CourseType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                language: { type: GraphQLString },
                date: { type: GraphQLString },
                professorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Course.findByIdAndUpdate(
                    args.id, {
                        name: args.name,
                        language: args.language,
                        date: args.date,
                        professorId: args.professorId
                    }, {
                        new: true
                    })
            }
        },
        //Elimiar coursos por Id
        deleteCourse: {
            type: CourseType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Course.findByIdAndDelete(args.id);
            }
        },
        //Eliminar todos los Courses
        deleteAllCourses: {
            type: CourseType,
            resolve(parent, args) {
                return Course.deleteMany({});
            }
        },
        //Agregar un nuevo profesor
        addProfessor: {
            type: ProfessorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                active: { type: GraphQLBoolean },
                date: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Professor(args).save();
            }
        },
        //Actualizar Profesor existente por id
        updateProfessor: {
            type: ProfessorType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                active: { type: GraphQLBoolean },
                date: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Professor.findByIdAndUpdate(
                    args.id, {
                        name: args.name,
                        age: args.age,
                        active: args.active,
                        date: args.date
                    }, {
                        new: true
                    })
            }
        },
        //Eliminar Profesor por Id
        deleteProfessor: {
            type: ProfessorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Professor.findByIdAndDelete(args.id);
            }
        },
        //Eliminar todos los profesores
        deleteAllProfessor: {
            type: ProfessorType,
            resolve(parent, args) {
                return Professor.deleteMany({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})