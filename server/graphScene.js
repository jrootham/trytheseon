/**
 * graphScene.js
 *
 * Created by jrootham on 28/05/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull
} from "graphql";
import {Scene} from "../database/defineDB";

export const GraphScene = new GraphQLObjectType({
    name: "GraphScene",
    description: "A scene object",
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve: scene => {
                    return scene.id;
                }
            },
            width: {
                type: GraphQLInt,
                resolve: scene => {
                    return scene.width;
                }
            },
            height: {
                type: GraphQLInt,
                resolve: scene => {
                    return scene.height;
                }
            },
            savedAt: {
                type: GraphQLString,
                resolve: scene => {
                    return scene.updatedAt;
                }
            }
        }
    }
});


const baseDataArgs = {
    name: {
        type: new GraphQLNonNull(GraphQLString)
    },
    width: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    height: {
        type: new GraphQLNonNull(GraphQLInt)
    }
};

const copyBase = src => {
    return {
        name: src.name,
        width: src.width,
        height: src.height
    }
};

export const saveScene = {
    type: GraphScene,
    args: baseDataArgs,
    resolve(_, args, session) {
        const data = copyBase(args);
        data.userId = session.userId;
        return Scene.create(data);
    }
};

const updateArgs = base => {
    const result = copyBase(base);
    result.id = {type: new GraphQLNonNull(GraphQLInt)};

    return result;
};

export const updateScene = {
    type: GraphScene,
    args: updateArgs(baseDataArgs),
    resolve(_, args, session) {
        const data = copyBase(args);
        return Scene.findById(args.id).then(result => {
            if (session.userId != result.userId) {
                throw new Error(`User ${session.userId} is not owner ${result.userId}`);
            }
            const newData = copyBase(args);
            Scene.update(newData, {where: {id: args.id}});
            return Scene.findById(args.id);
        })
    }
};



