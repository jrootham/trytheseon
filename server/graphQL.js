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
                type: GraphUser,
                resolve: (root, args, session) => {
                    console.log("root", root);
                    console.log("args", args);
                    console.log("session", session);
                }
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

const mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: "Modification actions",
    fields() {
        return {
            registerUser: {
                type: GraphUser,
                args: credentials,
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
                                User.create({
                                    name: args.name,
                                    password: hash
                                });

                                console.log(result);
                                return result;
                            });
                        }
                        else {
                            session.userId = 0;
                            session.signedOn = false;
                            session.existed = true;
                            console.log("existed");
                            return user;
                        }
                    });
                }
            },
            signonUser: {
                type: GraphUser,
                args: credentials,
                resolve(_, args, session) {
                    console.log("resolve", args);
                    User.findOne({where:{name:args.name}}).then(user => {
                        console.log("After find", user);
                        if (user != null) {
                            bcrypt.compare(args.password, user.password, (err, res) => {
                                if (res) {
                                    session.userId = user.id;
                                    session.signedOn = true;
                                    session.existed = true;
                                    console.log(user);
                                    return user;
                                }
                                else {
                                    session.userId = 0;
                                }
                            });
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

