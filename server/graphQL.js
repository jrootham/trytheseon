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

const User = new GraphQLObjectType({
    name: "User",
    description: "A user object",
    fields: () => {
        return {
            name: {
                type: GraphQLString,
                resolve: () => {
                    return "Name";
                }
            },
            signedOn: {
                type: GraphQLBoolean,
                resolve: () => {
                    return true;
                }
            }
        }
    }
});

const query = new GraphQLObjectType({
    name: 'Queries',
    fields: () => {
        return {
            user: {
                type: User
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
                type: User,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args) {
                    console.log(args.name, args.password);
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

