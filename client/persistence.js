/**
 * persistence.js
 *
 * Created by jrootham on 17/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

class Persistence {
    send(message) {
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

        return fetch(`${origin}/graphql${query}`, options)
            .then(this.status)
            .then(this.json)
            .catch(function(error) {
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
        return `(name: "${name}", password:"${password}")`;
    }

    registerCustomer(name, password){
        const credentials = this.setNamePassword(name, password);
        const values = "{name signedOn}";
        const base = "mutation registerUser";
        return this.send(`${base}{registerUser${credentials} ${values}}`);
    }

    signOn(name, password){
        const credentials = this.setNamePassword(name, password);
        const values = "{name signedOn}";
        const base = "mutation signonUser";
        return this.send(`${base}{signonUser${credentials} ${values}}`);
    }

    signOff(name){
        const credentials = `(name: "${name}")`;
        const values = "{name signedOn}";
        const base = "mutation signoffUser";
        return this.send(`${base}{signoffUser${credentials} ${values}}`);
    }
    
    makePictureData(picture) {
        const name = `name:"${picture.name}"`;
        const clipX = `clipX:${picture.clipX}`;
        const clipY = `clipY:${picture.clipY}`;
        const clipWidth = `clipWidth:${picture.clipWidth}`;
        const clipHeight = `clipHeight:${picture.clipHeight}`;
        const centroidX = `centroidX:${picture.centroidX}`;
        const centroidY = `centroidY:${picture.centroidY}`;
        const image = `image:${picture.image}`;
        
        const first =`${name} ${clipX} ${clipY} ${clipHeight} ${clipWidth} `;
        const second = `${centroidX} ${centroidY} ${image}`;
        return `${first} ${second}`;
    }
    
    savePicture(picture) {
        const pictureData =`(${this.makePictureData(picture)})`;
        const values = "{id}";
        const base = "mutation savePicture";
        return this.send(`${base} {savePicture ${pictureData} ${values}}`);
    }

    updatePicture(picture) {
        const pictureData = `(${this.makePictureData(picture)} id:${picture.id})`
        const values = "{id}";
        const base = "mutation updatePicture";
        return this.send(`${base} {updatePicture${pictureData} ${values}}`);
    }

    getPictureList() {
        const message = "query getPictureList{getPictureList {id name}}";
        return this.send(message);
    }

    getPicture(id) {
        const which = `(id:${id})`;
        const list = "id owned image name clipX clipY clipWidth clipHeight centroidX centroidY";
        const message = `query getPicture{getPicture ${which} {${list}}}`;
        return this.send(message);
    }

    saveScene(scene) {
        const base = "mutation saveScene";
        const values = "{id savedAt}";
        const name = `name:"${scene.name}"`;
        const width = `width:${scene.width}`;
        const height = `height:${scene.height}`;
        const sceneData = `(${name} ${width} ${height})`
        return this.send(`${base} {saveScene ${sceneData} ${values}}`);
    }

    updateScene(scene) {
        const base = "mutation updateScene";
        const values = "{id savedAt}";
        const id = `id:${scene.id}`;
        const name = `name:"${scene.name}"`;
        const width = `width:${scene.width}`;
        const height = `height:${scene.height}`;
        const sceneData = `(${id} ${name} ${width} ${height})`
        return this.send(`${base} {updateScene ${sceneData} ${values}}`);
    }
}

const persistence = new Persistence();

export default persistence;
