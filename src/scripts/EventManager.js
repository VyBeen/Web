import API from "./API";
import User from "./User";

export default class EventManager {
    static _instance = null;
    /**
     * @return {EventManager}
     */
    static get Instance () {
        if (EventManager._instance === null) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    listeners = [];
    events = [];
    constructor() {
        this.io = io(import.meta.env.VITE_SOCKETIO_HOST, { path: import.meta.env.VITE_SOCKETIO_PATH });

        this.io.on('connect', () => {
            this.io.emit('auth', User.CurrentUser.token);
            this.io.onAny((type, data) => {
                const ev = { type, data };
                this.listeners.forEach(l => l(ev))
            });
        });
    }

    addListener (callback) {
        this.listeners.push(callback);
    }
}
