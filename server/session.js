/**
 * session.js
 *
 * Created by jrootham on 18/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import session from "express-session";
import {secret} from "./things";

export const useSession = app => {
    const options = {
        secret: secret,
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    };
    
    app.use(session(options));
}
