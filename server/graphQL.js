/**
 * graphQL.js
 *
 * Created by jrootham on 18/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import graphqlHTTP from "express-graphql";
import {
    GraphQLSchema,
    GraphQLObjectType
} from 'graphql';
import {maskErrors} from "graphql-errors";

import {registerUser, signonUser, signoffUser} from "./graphUser";
import {savePicture, updatePicture, getPictureList, getPicture} from "./graphPicture";
import {saveScene, updateScene} from "./graphScene";

const query = new GraphQLObjectType({
    name: 'Queries',
    fields: () => {
        return {
            getPictureList: getPictureList,
            getPicture: getPicture
        }
    }
});


const mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: "Modification actions",
    fields() {
        return {
            registerUser: registerUser,
            signonUser: signonUser,
            signoffUser: signoffUser,
            
            savePicture: savePicture,
            updatePicture: updatePicture,
            
            saveScene: saveScene,
            updateScene: updateScene
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

