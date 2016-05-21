/**
 * graphQL.js
 *
 * Created by jrootham on 18/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import graphqlHTTP from "express-graphql";
import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean
} from 'graphql';
import {maskErrors, UserError} from "graphql-errors";

import {hash, compare} from "bcrypt"
import {connect, User} from "../database/defineDB";

const GraphUser = new GraphQLObjectType({
    name: "GraphUser",
    description: "A user object",
    fields: () => {
        return {
            name: {
                type: GraphQLString,
                resolve: (user, _, session) => {
                    if (session.userId === user.id) {
                        return user.name;
                    }
                    else {
                        return "";
                    }
                } 
            },

            signedOn: {
                type: GraphQLBoolean,
                resolve(user, _, session) {
                    return session.userId === user.id;
                }
            }
        }
    }
});

const query = new GraphQLObjectType({
    name: 'Queries',
    fields: () => {
        return {
            graphUser: {
                type: GraphUser
            }
        }
    }
});

const credentials = {
    name: {
        type: new GraphQLNonNull(GraphQLString)
    },
    password: {
        type: new GraphQLNonNull(GraphQLString)
    }
};

const makeHash = password => {
    return new Promise(
        resolve => {
            hash(password, 10, (err, hash) => {
                resolve(hash);
            });
        }
    );
}

const makeCompare = (password, hash) => {
    return new Promise(
        resolve => {
            compare(password, hash, (err, match) => {
                resolve(match);
            });
        }
    );
}

const mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: "Modification actions",
    fields() {
        return {
            registerUser: {
                type: GraphUser,
                args: credentials,
                resolve(_, args, session) {
                    if (args.name === "") {
                        session.userId = 0;
                        throw new UserError(`Name may not be blank`);
                    }

                    if (args.password === "") {
                        session.userId = 0;
                        throw new UserError(`Password may not be blank`);
                    }

                    return User.findOne({where:{name:args.name}}).then(user => {

                        if (user != null) {
                            session.userId = 0;
                            throw new UserError(`Name ${args.name} already exists`);
                        }
                        else {
                            return makeHash(args.password).then(hash => {
                                return User.create({
                                    name: args.name,
                                    password: hash
                                }).then(newUser =>{
                                    session.userId = newUser.id;
                                    return newUser;
                                })
                            });
                        }
                    });
                }
            },

            signonUser: {
                type: GraphUser,
                args: credentials,
                resolve(_, args, session) {
                    const result = User.findOne({where:{name:args.name}}).then(user => {
                        if (user === null) {
                            throw new UserError(`Name ${args.name} not found`)
                        }
                            return makeCompare(args.password, user.password).then (match => {
                                if (!match) {
                                    throw new UserError(`Bad password`);
                                }
                                session.userId = user.id;

                                return user;

                            });
                        });

                    return result;
                }
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: query,
    mutation: mutation
});

maskErrors(schema);

export const useGraphQL = app => {
    app.use('/graphql', graphqlHTTP(request =>({
        schema: schema,
        context: request.session,
        graphiql:true
    })));
};

