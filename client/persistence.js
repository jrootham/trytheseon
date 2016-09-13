/**
 * persistence.js
 *
 * Created by jrootham on 17/04/16.
 *
 * Copyright © 2016 Jim Rootham
 */

import {makePictureURL} from "./makePictureURL";

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
        const thumbnail = `thumbnail:${picture.thumbnail}`;

        const image = `image:${makePictureURL(picture.image)}`;
        
        const first =`${name} ${clipX} ${clipY} ${clipHeight} ${clipWidth} `;
        const second = `${centroidX} ${centroidY}`;
        return `${first} ${second} ${thumbnail} ${image}`;
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
        const list1 = "id owned image thumbnail name clipX clipY";
        const list2 = "clipWidth clipHeight centroidX centroidY";
        const message = `query getPicture{getPicture ${which} {${list1} ${list2}}}`;
        return this.send(message);
    }


    getSceneList() {
        const message = "query getSceneList{getSceneList {id name}}";
        return this.send(message);
    }

    getScene(id) {
        const which = `(id:${id})`;
        const list1 = "id name height width savedAt pictureList";
        const list2 = "{name clipX clipY clipWidth clipHeight centroidX centroidY";
        const list3 = "x y z scale rotate image}";

        const result = `${list1} ${list2} ${list3}`;
        const message = `query getScene{getScene ${which} {${result}}}`;
        return this.send(message);
    }

    scenePictureFormat(scenePicture) {
        const name = `name:"${scenePicture.name}"`;
        const clipX = `clipX:${scenePicture.clipX}`;
        const clipY = `clipY:${scenePicture.clipY}`;
        const clipWidth = `clipWidth:${scenePicture.clipWidth}`;
        const clipHeight = `clipHeight:${scenePicture.clipHeight}`;
        const centroidX = `centroidX:${scenePicture.centroidX}`;
        const centroidY = `centroidY:${scenePicture.centroidY}`;
        const image = `image:${makePictureURL(scenePicture.image)}`;
        const rotate = `rotate:${scenePicture.rotate}`;
        const x = `x:${scenePicture.x}`;
        const y = `y:${scenePicture.y}`;
        const scale = `scale:${scenePicture.scale}`;
        const z = `z:${scenePicture.z}`;

        const first = `${name} ${clipX} ${clipY} ${clipWidth} ${clipHeight}`;
        const second = `${centroidX} ${centroidY} ${rotate} ${x} ${y}`;
        const third = `${scale} ${z}`;
        
        return `{${first} ${second} ${third} ${image}} `;
    }
    
    saveSceneList(scene) {
        let result ="pictureList:[";
        scene.scenePictures.forEach(scenePicture => {
            result += this.scenePictureFormat(scenePicture);
        })

        result += "]";

        return result;
    }

    saveScene(scene) {
        const base = "mutation saveScene";
        const values = "{id savedAt}";
        const name = `name:"${scene.name}"`;
        const width = `width:${scene.width}`;
        const height = `height:${scene.height}`;
        const sceneList = `${this.saveSceneList(scene)}`;
        const sceneData = `(${name} ${width} ${height} ${sceneList})`;
        return this.send(`${base} {saveScene ${sceneData} ${values}}`);
    }

    updateScene(scene) {
        const base = "mutation updateScene";
        const values = "{id savedAt}";
        const id = `id:${scene.id}`;
        const name = `name:"${scene.name}"`;
        const width = `width:${scene.width}`;
        const height = `height:${scene.height}`;
        const sceneList = `${this.saveSceneList(scene)}`;
        const sceneData = `(${id} ${name} ${width} ${height} ${sceneList})`
        return this.send(`${base} {updateScene ${sceneData} ${values}}`);
    }

    newTag(entry) {
        const base = "mutation newTag";
        const values = "{id, name}";
        const data = `(name:"${entry}")`;
        return this.send(`${base} {newTag ${data} ${values}}`);
    }

    getTagList() {
        const message = "query getTagList{getTagList {id, name}}";
        return this.send(message);
    }
}


const persistence = new Persistence();

export default persistence;
