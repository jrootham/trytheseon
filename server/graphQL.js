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
import {hash} from "bcrypt"
import {connect, User} from "../database/defineDB";

const GraphUser = new GraphQLObjectType({
    name: "GraphUser",
    description: "A user object",
    fields: () => {
        return {
            name: {
                type: GraphQLString,
                resolve: (_, __, session) => {
                    console.log("resolve name", session);
                    let name = "";
                    if (session.signedOn) {
                        return User.findById(session.userId).then (user => {
                            return user.name;
                        });
                    }

                    console.log("name", name);
                    return name;
                }
            },
            signedOn: {
                type: GraphQLBoolean,
                resolve: (_, __, session) => {
                    return session.signedOn;
                }
            },
            existed: {
                type: GraphQLBoolean,
                resolve: (_, __, session) => {
                    return session.existed;
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

const mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: "Modification actions",
    fields() {
        return {
            registerUser: {
                type: GraphUser,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args, session) {
                    console.log("resolve", args);
                    User.findOne({where:{name:args.name}}).then(user => {
                        console.log("After find", user);
                        if (user === null) {
                            const getHash = new Promise(
                                resolve => {
                                    hash(args.password, 10, (err, hash) => {
                                        resolve(hash);
                                    });
                                }
                            );

                            const result = getHash.then(hash => {
                                connect.models.user.create({
                                    name: args.name,
                                    password: hash
                                }).then(user => {
                                    session.userId = user.id;
                                    session.signedOn = true;
                                    session.existed = false;

                                    console.log("session user", session.userId);
                                    return user;
                                });

                                console.log(result);
                                return result;
                            });
                        }
                        else {
                            console.log("existed");
                                return GraphUser;
                        }
                    });
                }
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: query,
    mutation: mutation
});

export const useGraphQL = app => {
    app.use('/graphql', graphqlHTTP(request =>({
        schema: schema,
        context: request.session,
        formatError: error => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack
        }),
        graphiql:true
    })));
};

