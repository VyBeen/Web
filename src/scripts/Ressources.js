import API from "./API";
import User from "./User";

let room = null;

let player = null;

let playlist = null;

let songs = {};

let users = {};

class AwaitedObject {
    constructor(promise) {
        this.queue = [];
        this.data = null;
        this.promise = promise;
        promise.then(data => {
            this.data = data;
            this.triggerResponses();
        }).catch(err => {
            this.triggerErrors(err);
        });
    }

    async get() {
        return new Promise((resolve, reject) => {
            this.queue.push({resolve, reject});
            if (this.data !== null) {
                this.triggerResponses();
            }
        });
    }

    triggerResponses() {
        this.queue.forEach(({resolve, reject}) => { resolve(this.data); });
        this.queue = [];
    }

    triggerErrors(err) {
        this.queue.forEach(({resolve, reject}) => { reject(err); });
        this.queue = [];
    }
}

/**
 * @return {{
*  id: number,
*  name: string,
*  playlistId: number,
*  playerId: number
* }}
*/
export async function getRoom(reload=false) {
    if (reload || room === null)
        room = fetchRoom();
    return await room.get();
}

export function fetchRoom() {
    return new AwaitedObject(new Promise((resolve, reject) => {
        if (!User.CurrentUser) return reject();
        API.execute_logged(API.ROUTE.ROOMS(User.CurrentUser.roomId))
            .then(res => resolve(res.data))
            .catch(reject);
    }));
}

/**
 * @return {{
*  id: number
*  roomId: number
*  headId: number
*  tailId: number
* }}
*/
export async function getPlaylist(reload=false) {
    if (reload || playlist === null)
        playlist = fetchPlaylist();
    return await playlist.get();
}

export function fetchPlaylist() {
    return new AwaitedObject(new Promise((resolve, reject) => {
        if (!User.CurrentUser) return reject();
        getRoom().then(room => {
            API.execute_logged(API.ROUTE.PLAYLISTS(room.playlistId))
                .then(res => resolve(res.data))
                .catch(reject);
        }).catch(reject);
    }));
}

/**
 * @return {{
 *  id: number
 *  position: number
 *  cursorDate: Date
 *  playing: boolean
 *  songId: number
 *  roomId: number
 * }}
 */
export async function getPlayer(reload=false) {
    if (reload || player === null)
        player = fetchPlayer();
    return await player.get();
}

export function fetchPlayer() {
    return new AwaitedObject(new Promise((resolve, reject) => {
        if (!User.CurrentUser) return reject();
        getRoom().then(room => {
            API.execute_logged(API.ROUTE.PLAYERS(room.playerId))
                .then(res => resolve({
                    ...res.data,
                    cursorDate: new Date(res.data.cursorDate)
                }))
                .catch(reject);
        }).catch(reject);
    }));
}

/**
 * @return {{
*  id: number
*  title: string
*  artist: string
*  cover: string
*  url: string
*  nextId: number
* }}
*/
export async function getSong(id, reload=false) {
    if (reload || songs[id] === undefined || songs[id] === null)
        songs[id] = fetchSong(id);
    return await songs[id].get();
}

export function fetchSong(id) {
    return new AwaitedObject(new Promise((resolve, reject) => {
        if (!User.CurrentUser) return reject();
        getPlaylist().then(playlist => {
            API.execute_logged(API.ROUTE.PLAYLIST_SONG(playlist.id, id))
                .then(res => resolve(res.data))
                .catch(reject);
        }).catch(reject);
    }));
}

/**
 * @return {{
*  id: number
*  furwazId: number
*  pseudo: string
*  roomId: number
* }}
*/
export async function getUser(id, reload=false) {
    if (reload || users[id] === undefined || users[id] === null)
        users[id] = fetchUser(id);
    return await users[id].get();
}

export function fetchUser(id) {
    return new AwaitedObject(new Promise((resolve, reject) => {
        if (!User.CurrentUser) return reject();
        API.execute_logged(API.ROUTE.USERS(id))
            .then(res => resolve(res.data))
            .catch(reject);
    }));
}
