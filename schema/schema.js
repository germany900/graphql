const graphql = require('graphql');
const Course = require('../models/course');
const Professor = require('../models/professor');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../utlis/auth');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLID } = graphql;

//Object type para Cursos
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
//Object type para Profesor
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
//Object type para usuario
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
//Mensaje para usuarios
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        message: { type: GraphQLString },
        token: { type: GraphQLString },
        error: { type: GraphQLString }
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
        },
        addUser: {
            type: MessageType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                date: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let user = await User.findOne({ email: args.email })
                if (user) return { error: 'Usuario existente en la base de datos' }
                const salt = await bcrypt.genSalt(12);
                const hashPassword = await bcrypt.hash(args.password, salt);
                user = new User({
                    name: args.name,
                    email: args.email,
                    date: args.date,
                    password: hashPassword
                });
                user.save();
                return { message: 'User registrado correctamente' }
            }
        },
        login: {
            type: MessageType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const result = await auth.login(args.email, args.password, '1234');
                return {
                    message: result.message,
                    error: result.error
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})