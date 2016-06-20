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
        host:"localhost"
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
    owner: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
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
    }
});

export const Placement = connect.define("placement", {
    picture: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    scene: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    x: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    y: {
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

