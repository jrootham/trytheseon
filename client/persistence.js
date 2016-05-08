/**
 * persistence.js
 *
 * Created by jrootham on 17/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

class Persistence {
    send(message) {
        console.log(message);
        const origin = window.location.origin;
        const options = {
            credentials:    "include",
            cacheControl:   "no-cache",
            method:         "POST",
            headers: {
                "Content-Type": 'application/graphql'
            },
            body: message
        };

        const query = "";

        fetch(`${origin}/graphql${query}`, options)
            .then(this.status)
            .then(this.json)
            .then(function(data) {
                console.log(data);
                console.log(data.data);
                console.log(data.data.registerUser);
            }).catch(function(error) {
            console.log('Request failed', error);
        });
    }

    status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

    json(response) {
    return response.json()
}

    setNamePassword(name, password) {
        return `(name: "${name}", password:"${password}") {name signedOn}`
    }

    registerCustomer(name, password){
        this.send(`mutation registerUser{registerUser${this.setNamePassword(name, password)}}`);
    }

    signOn(name, password){
        this.send(`{__schema {types {name fields {name type {name kind}}}}}`);
    }

}

const persistence = new Persistence();

export default persistence;
