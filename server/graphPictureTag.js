/**
 * graphPictureTag.js
 *
 * Created by jrootham on 23/09/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList
} from "graphql";

import {PictureTag, Picture} from "../database/defineDB";

export const GraphPictureTag = new GraphQLObjectType({
    name: "GraphPictureTag",
    description: "A picture tag relation",
    fields: {
        pictureId: {
            type: GraphQLInt,
            resolve: (pictureTag) => {
                return pictureTag.pictureId;
            }
        },
        tagId: {
            type: GraphQLInt,
            resolve: (pictureTag) => {
                return pictureTag.tagId;
            }
        }
    }
});

export const newPictureTags = {
    type: new GraphQLList(GraphPictureTag),
    args: {
        pictureId: {type: new GraphQLNonNull(GraphQLInt)},
        tagList: {type: new GraphQLNonNull(new GraphQLList(GraphQLInt))}
    },
    resolve(_, args, session) {
        return Picture.findById(args.pictureId).then(result => {
            if (session.userId != result.userId) {
                throw new Error(`User ${session.userId} is not owner ${result.userId}`);
            }

            return PictureTag.destroy({where: {pictureId: args.pictureId}})
                .then(() => {
                args.tagList.forEach(tagId => {
                    return PictureTag.create({
                        pictureId: args.pictureId,
                        tagId: tagId
                    })
                })
            }).catch(error =>{

            })
        })
    }
};

export const getPictureTagList = {
    type: new GraphQLList(GraphPictureTag),
    args: {
        pictureId: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve(_, args, __) {
        return PictureTag.findAll({
            where: {pictureId: args.pictureId}
        })
    }
};
