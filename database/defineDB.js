/**
 * defineDB.js
 *
 * Created by jrootham on 03/05/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import Sequelize from "sequelize";

import {user, password, database} from "../server/things";

export const connect = new Sequelize(
    database,
    user,
    password,
    {
        dialect: "postgres",
        host:"localhost",
        logging: false
    });

export const User = connect.define("user", {
    name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull:false
    }
});

export const Picture = connect.define("picture", {
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    thumbnail: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    clipX: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipY: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipHeight: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipWidth: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    centroidX: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    centroidY: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
});

User.hasMany(Picture);

export const Scene = connect.define("scene", {
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    height: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    width: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
});

User.hasMany(Scene);

export const ScenePicture = connect.define("scenePicture", {
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    clipX: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipY: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipHeight: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    clipWidth: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    centroidX: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    centroidY: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    x: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    y: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    z: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    scale: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    rotate: {
        type: Sequelize.FLOAT,
        allowNull:false
    }
});

Scene.hasMany(ScenePicture);
ScenePicture.belongsTo(Scene);

export const Tag = connect.define("tag", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

Tag.belongsToMany(Picture, {through: "pictureTag"});
Picture.belongsToMany(Tag, {through: "pictureTag"});

