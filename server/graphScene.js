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
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql";
import {Scene, ScenePicture} from "../database/defineDB";

export const GraphScenePicture = new GraphQLObjectType({
    name: "GraphScenePicture",
    description: "A scene picture object",
    fields:{
        id: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: scenePicture => {
                return scenePicture.name;
            }
        },
        clipX: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.clipX;
            }
        },
        clipY: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.clipY;
            }
        },
        clipWidth: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.clipWidth;
            }
        },
        clipHeight: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.clipHeight;
            }
        },
        centroidX: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.centroidX;
            }
        },
        centroidY: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.centroidY;
            }
        },
        x: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.x;
            }
        },
        y: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.y;
            }
        },
        z: {
            type: GraphQLInt,
            resolve: scenePicture => {
                return scenePicture.z;
            }
        },
        scale: {
            type: GraphQLFloat,
            resolve: scenePicture => {
                return scenePicture.scale;
            }
        },
        rotate: {
            type: GraphQLFloat,
            resolve: scenePicture => {
                return scenePicture.rotate;
            }
        },
        image: {
            type: GraphQLString,
            resolve: scenePicture => {
                return scenePicture.image;
            }
        }
    }
});

const scenePictureInput = new GraphQLInputObjectType({
    name: "scenePictureInput",
    fields:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        clipX: {type: new GraphQLNonNull(GraphQLInt)},
        clipY: {type: new GraphQLNonNull(GraphQLInt)},
        clipWidth: {type: new GraphQLNonNull(GraphQLInt)},
        clipHeight: {type: new GraphQLNonNull(GraphQLInt)},
        centroidX: {type: new GraphQLNonNull(GraphQLInt)},
        centroidY: {type: new GraphQLNonNull(GraphQLInt)},
        x: {type: new GraphQLNonNull(GraphQLInt)},
        y: {type: new GraphQLNonNull(GraphQLInt)},
        z: {type: new GraphQLNonNull(GraphQLInt)},
        scale: {type: new GraphQLNonNull(GraphQLFloat)},
        rotate: {type: new GraphQLNonNull(GraphQLFloat)},
        image: {type: new GraphQLNonNull(GraphQLString)}
    }
});

export const GraphScene = new GraphQLObjectType({
    name: "GraphScene",
    description: "A scene object",
    fields:{
        id: {
            type: GraphQLInt,
            resolve: scene => {
                return scene.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: scene => {
                return scene.name;
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
        },
        pictureList: {
            type: new GraphQLList(GraphScenePicture),
            resolve: scene => {
                return scene.getScenePictures();
            }
        }
    }
});

const baseDataArgs = {
    name: {type: new GraphQLNonNull(GraphQLString)},
    width: {type: new GraphQLNonNull(GraphQLInt)},
    height: {type: new GraphQLNonNull(GraphQLInt)},
    pictureList: {type: new GraphQLList(scenePictureInput)}
};

const copyBase = src => {
    return {
        name: src.name,
        width: src.width,
        height: src.height
    }
};

const copyAll = src => {
    const result = copyBase(src);
    result.pictureList = src.pictureList;

    return result;
};

const saveResult = new GraphQLObjectType({
    name: "saveResult",
    description: "Return type from save functions",
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve: scene => {
                    return scene.id;
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

const copyPicture = src => {
    return {
        name: src.name,
        clipX: src.clipX,
        clipY: src.clipY,
        clipWidth: src.clipWidth,
        clipHeight: src.clipHeight,
        centroidX: src.centroidX,
        centroidY: src.centroidY,
        x: src.x,
        y: src.y,
        z: src.z,
        scale: src.scale,
        rotate: src.rotate,
        image: src.image
    }
};

const saveList = (sceneId, list) => {
    list.forEach(scenePicture => {
        const pictureData = copyPicture(scenePicture);
        pictureData.sceneId = sceneId;
        ScenePicture.create(pictureData);
    });
};

export const saveScene = {
    type: saveResult,
    args: baseDataArgs,
    resolve(_, args, session) {
        const data = copyBase(args);
        data.userId = session.userId;
        const result = Scene.create(data).then(scene => {
            saveList(scene.id, args.pictureList);
            return scene;
        })
        return result;
    }
};

const updateArgs = base => {
    const result = copyAll(base);
    result.id = {type: new GraphQLNonNull(GraphQLInt)};

    return result;
};

export const updateScene = {
    type: saveResult,
    args: updateArgs(baseDataArgs),
    resolve(_, args, session) {
        const data = copyBase(args);
        return Scene.findById(args.id).then(result => {
            if (session.userId != result.userId) {
                throw new Error(`User ${session.userId} is not owner ${result.userId}`);
            }
            const newData = copyBase(args);
            Scene.update(newData, {where: {id: args.id}});
            ScenePicture.destroy({where:{sceneId:args.id}});
            saveList(args.id, args.pictureList);
            return result;
        })
    }
};

export const getSceneList = {
    type: new GraphQLList(GraphScene),
    resolve(_, __, session) {
        if (!"userId" in session) {
            throw Error("No userId in session")
        }
        return Scene.findAll({
            where: {userId: session.userId}
        })
    }
};

export const getScene = {
    type: GraphScene,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve(_, args) {
        return Scene.findByPrimary(args.id);
    }
};


