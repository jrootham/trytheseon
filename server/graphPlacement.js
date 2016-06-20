/**
 * graphPlacement.js
 *
 * Created by jrootham on 28/05/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} from "graphql";
import {Placement} from "../database/defineDB";

export const GraphPlacement = new GraphQLObjectType({
    name: "GraphPlacement",
    description: "A placement object",
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve: (placement) => {
                    return placement.id;
                }
            }
        }
    }
});
