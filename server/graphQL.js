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
import {saveScene, updateScene, GraphScene, getSceneList, getScene} from "./graphScene";
import {newTag, getTagList} from "./graphTag";

const query = new GraphQLObjectType({
    name: 'Queries',
    description: "Query actions",
    fields: {
        getPictureList: getPictureList,
        getPicture: getPicture,
        getSceneList: getSceneList,
        getScene: getScene,
        getTagList: getTagList
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: "Modification actions",
    fields: {
        registerUser: registerUser,
        signonUser: signonUser,
        signoffUser: signoffUser,
        
        savePicture: savePicture,
        updatePicture: updatePicture,
        
        saveScene: saveScene,
        updateScene: updateScene,

        newTag: newTag
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

