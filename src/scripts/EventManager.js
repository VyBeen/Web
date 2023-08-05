import API from "./API";

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
        this.fetchEvents(300);
    }

    fetchEvents (repeat = 0) {
        API.execute_logged(API.ROUTE.EVENTS()).then(res => {
            res.data.forEach(ev => this.events.push(ev));

            if (this.events.length) {
                this.events.forEach(ev => this.listeners.forEach(l => l(ev)));
                this.events = [];
            }

            if (repeat > 0) {
                setTimeout(() => {
                    this.fetchEvents(repeat);
                }, repeat);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    addListener (callback) {
        this.listeners.push(callback);
    }
}
