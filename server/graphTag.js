/**
 * GraphCatalogue.js
 *
 * Created by jrootham on 02/08/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLList
} from "graphql";

import {Tag} from "../database/defineDB";

export const GraphTag = new GraphQLObjectType({
    name: "GraphTag",
    description: "A tag object",
    fields: {
        id: {
            type: GraphQLInt,
            resolve: (tag) => {
                return tag.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (tag) => {
                return tag.name;
            }
        }
    }
});

export const newTag = {
    type: GraphTag,
    args: {name: {type: new GraphQLNonNull(GraphQLString)}},
    resolve(_, args, __) {
        return Tag.create(args);
    }
};

export const getTagList = {
    type: new GraphQLList(GraphTag),
    resolve() {
        return Tag.findAll({
            order:[['name', 'ASC']]
        })
    }
};
