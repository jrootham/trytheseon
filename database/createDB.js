/**
 * createDB.js
 *
 * Created by jrootham on 03/05/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {connect, Tag} from "./defineDB";

connect.sync({force: true}).then(() => {
    Tag.create({name:"Promoted"})
});

