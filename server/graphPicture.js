/**
 * graphPicture.js
 *
 * Created by jrootham on 28/05/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql";
import {Picture} from "../database/defineDB";

export const GraphPicture = new GraphQLObjectType({
    name: "GraphPicture",
    description: "A picture object",
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.id;
                }
            },
            owned: {
                type: GraphQLBoolean,
                resolve: (picture, _, session) => {
                    return "userId" in session  && picture.owner === session.userId;
                }
            },
            image: {
                type: GraphQLString,
                resolve: (picture) => {
                    return picture.image;
                }
            },
            name: {
                type: GraphQLString,
                resolve: (picture) => {
                    return picture.name;
                }
            },
            clipX: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.clipX;
                }
            },
            clipY: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.clipY;
                }
            },
            clipWidth: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.clipWidth;
                }
            },
            clipHeight: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.clipHeight;
                }
            },
            centroidX: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.centroidX;
                }
            },
            centroidY: {
                type: GraphQLInt,
                resolve: (picture) => {
                    return picture.centroidY;
                }
            }
        }
    }
});

const baseDataArgs = {
    name: {
        type: new GraphQLNonNull(GraphQLString)
    },
    clipX: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    clipY: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    clipWidth: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    clipHeight: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    centroidX: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    centroidY: {
        type: new GraphQLNonNull(GraphQLInt)
    }
};

const copyBase = src => {
    return {
        name: src.name,
        clipX: src.clipX,
        clipY: src.clipY,
        clipWidth: src.clipWidth,
        clipHeight: src.clipHeight,
        centroidX: src.centroidX,
        centroidY: src.centroidY
    }
};

const saveArgs = base => {
    const result = copyBase(base);
    result.image = {type: new GraphQLNonNull(GraphQLString)};
    
    return result;
};

export const savePicture = {
    type: GraphPicture,
    args: saveArgs(baseDataArgs),
    resolve(_, args, session) {
        const data = copyBase(args);
        data.image = args.image;
        data.owner = session.userId;
        console.log(data);
        return Picture.create(data);
    }
};

const updateArgs = base => {
    const result = copyBase(base);
    result.id = {type: new GraphQLNonNull(GraphQLInt)};

    return result;
};

export const updatePicture = {
    type: GraphPicture,
    args: updateArgs(baseDataArgs),
    resolve(_, args, session) {
        return Picture.findById(args.id).then(result => {
            if (session.userId != result.owner) {
                throw new Error(`User ${session.userId} is not owner ${result.owner}`);
            }
            const newData = copyBase(args);
            Picture.update(newData, {where:{id:args.id}});
            return Picture.findById(args.id);
        })

    }
};

export const getPicture = {
    type: GraphPicture,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve(_, args) {
        return Picture.findByPrimary(args.id);
    }
};

export const getPictureList = {
    type: new GraphQLList(GraphPicture),
    resolve(_, __, session) {
        if (!"userId" in session) {
            throw Error("No userId in session")
        }
        return Picture.findAll({where: {owner: session.userId}});
    }
};

