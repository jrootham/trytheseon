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
                console.log('Request succeeded with JSON response', data.data);
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
            return `(name: "${name}", password:"${password}") { name
        }`

    }

    registerCustomer(name, password){
        this.send(`mutation registerCustomer{registerCustomer${this.setNamePassword(name, password)}}`);
    }

    signOn(name, password){
        this.send(`query user {{user} name}`);
    }

}

const persistence = new Persistence();

export default persistence;
