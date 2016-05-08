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
