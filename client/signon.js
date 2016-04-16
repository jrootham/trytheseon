/**
 * signon.js
 *
 * Created by jrootham on 14/02/16.
 *
 * Copyright © 2016 Jim Rootham
 */
import React from "react";
import ReactDOM from "react-dom";

import {redraw} from "./index";
import {makeGoBack,send} from "./common";

const setNamePassword = (name, password) => {

}

const registerCustomer = (name, password) => {
//    send(`mutation registerCustomer { ${setNamePassword(name, password)} }`)
    send(`{ hello }`).then(value => {value.json().then(value => {console.log(value)})});
}

export default class Signon extends React.Component {
    signon() {

    }

    register() {
        const name = document.getElementById("registerName").value;
        const password = document.getElementById("registerPassword").value;

        registerCustomer(name, password);
    }

    render() {
        const cancel = <button onClick={makeGoBack(this.props.store)}>Cancel</button>

        return <div>
            <div>
                <h2>Signon</h2>
                <div>User name<input id="signonName" type="text"/></div>
                <div>Password<input id="signonPassword" type="password"/></div>
                <div>
                    <button onClick={this.signon.bind(this)}>Sign on</button>
                    {cancel}
                </div>
            </div>
            <div>
                <h2>Register</h2>
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