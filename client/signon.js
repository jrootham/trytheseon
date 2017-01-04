/**
 * signon.js
 *
 * Created by jrootham on 14/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {Constants} from "./data";

import {makeGoBack} from "./common";
import persistence from "./persistence";

const handleError = (store, error, thisPage) => {
    store.display.error = error.message;
    store.display.page = thisPage;
    store.signon.name = "";
    store.signon.on = false;
}

export default class Signon extends React.Component {
    signon() {
        const name = document.getElementById("signonName").value;
        const password = document.getElementById("signonPassword").value;

        const promise = persistence.signOn(name, password);
        promise.then( result => {
            const store = this.props.store;

            if ("errors" in result) {
                handleError(store, result.errors[0], Constants.page.SIGNON);
            }
            else {
                store.display.error = undefined;
                store.signon.name = result.data.signonUser.name;
                store.signon.on = result.data.signonUser.signedOn;
                store.display.page = store.display.previous;
            }
        });
    }

    register() {
        const name = document.getElementById("registerName").value;
        const password = document.getElementById("registerPassword").value;

        const promise = persistence.registerCustomer(name, password);
        promise.then(result => {
            const store = this.props.store;

            if ("errors" in result) {
                handleError(store, result.errors[0], Constants.page.REGISTER);
            }
            else {
                store.display.error = undefined;
                store.signon.name = result.data.registerUser.name;
                store.signon.on = result.data.registerUser.signedOn;
                store.display.page = store.display.previous;
            }
        });
    }
    
    render() {
        const display = this.props.store.display;
        const cancel = <button onClick={makeGoBack(this.props.store)}>Cancel</button>;
        const error = display.error ? display.error : "";

        const signonError = display.page === Constants.page.SIGNON ? error : "";
        const registerError = display.page === Constants.page.REGISTER ? error : "";

        return <div>
            <div>
                <h2>Signon</h2>
                <div className="error">{signonError}</div>
                <div>User name<input id="signonName" type="text"/></div>
                <div>Password<input id="signonPassword" type="password"/></div>
                <div>
                    <button onClick={this.signon.bind(this)}>Sign on</button>
                    {cancel}
                </div>
            </div>
            <div>
                <h2>Register</h2>
                <div className="error">{registerError}</div>
                <div>User name<input id="registerName" type="text"/></div>
                <div>Password<input id="registerPassword" type="password"/></div>
                {
                    //<div>
                    //   Re-enter password
                    //   <input id="registerPasswordRepeat" type="password"/>
                    //</div>
                }
                <div>
                    <button onClick={this.register.bind(this)}>Register</button>
                    {cancel}
                </div>
            </div>
        </div>
    }
}