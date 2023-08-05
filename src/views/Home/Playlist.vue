<template>
    <div class="flex flex-col items-center">
        <div class="w-full py-2 px-4">
            <input-text
                orientation="row"
                name="song-search"
                :label="Lang.CreateTranslationContext('playlist', 'SearchSong')"
            />
            <selector
                ref="song-selector"
                :oncompletion="onSongCompletion"
                :onclick="onSongSelected"
            />
        </div>
        <div class="flex w-full h-fit px-4">
            <span class="w-full rounded-full h-1 bg-slate-200 dark:bg-slate-600" />
        </div>
        <div
            ref="songs-container"
            class="relative flex flex-col h-full w-full overflow-x-hidden overflow-h-auto px-4 py-2"
        >
            <div
                v-for="(song, index) in songs"
                :id="'song-'+index"
                :key="song"
                ref="song-card"
                class="flex song-card justify-between items-center w-full md:h-20 h-[4.5em] my-2"
            >
                <button
                    class="flex md:w-16 w-12 h-16 md:p-4 p-2 items-center justify-center text-slate-500 cursor-grab hover:text-slate-400 transition-all"
                    @mousedown="startDrag"
                    @mouseup="stopDrag"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="h-full items-center justify-center"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M352 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm-160 0a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM64 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM224 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM32 320a32 32 0 1 0 64 0 32 32 0 1 0 -64 0z"/>
                    </svg>
                </button>
                <div
                    class="flex w-full h-full border-b-4 border-2 rounded-lg shadow-md bg-white dark:bg-slate-700 p-2 p-2"
                    :class="song.id === playingId ? 'border-green-500 shadow-lg shadow-green-500/[0.1]' : 'border-slate-200 dark:border-slate-800'"
                >
                    <div class="hidden md:flex min-w-fit h-full items-center mr-2">
                        <img
                            :src="song.cover"
                            alt="song cover"
                            class="flex w-12 h-12 object-cover"
                        >
                    </div>
                    <div class="flex grow flex-col justify-center items-start w-0 overflow-hidden mr-2">
                        <title-text class="w-fit text-center whitespace-nowrap text-ellipsis max-w-full"> {{ song.title }} </title-text>
                        <base-text class="w-fit text-center whitespace-nowrap text-ellipsis max-w-full"> {{ song.artist }} </base-text>
                    </div>
                    <div class="flex w-fit h-full items-center justify-end text-slate-400 space-x-2">
                        <button
                            v-if="song.id !== playingId"
                            class="flex h-10 w-10 p-1.5 rounded-md justify-center hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-green-500 transition-all"
                            @click="playSong(song.id)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 385 512" fill="currentColor" class="h-full items-center justify-center"
                            >
                                <path d="M56.3 66.3c-4.9-3-11.1-3.1-16.2-.3s-8.2 8.2-8.2 14V432c0 5.8 3.1 11.1 8.2 14s11.2 2.7 16.2-.3l288-176c4.8-2.9 7.7-8.1 7.7-13.7s-2.9-10.7-7.7-13.7l-288-176zM24.5 38.1C39.7 29.6 58.2 30 73 39L361 215c14.3 8.7 23 24.2 23 41s-8.7 32.2-23 41L73 473c-14.8 9.1-33.4 9.4-48.5 .9S0 449.4 0 432V80C0 62.6 9.4 46.6 24.5 38.1z"/>
                            </svg>
                        </button>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" class="h-full items-center justify-center h-8 text-green-500"
                        >
                            <path d="M320 0c8.8 0 16 7.2 16 16V496c0 8.8-7.2 16-16 16s-16-7.2-16-16V16c0-8.8 7.2-16 16-16zM512 64c8.8 0 16 7.2 16 16V432c0 8.8-7.2 16-16 16s-16-7.2-16-16V80c0-8.8 7.2-16 16-16zM224 96c8.8 0 16 7.2 16 16V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm192 32c8.8 0 16 7.2 16 16V368c0 8.8-7.2 16-16 16s-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM128 192c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V208c0-8.8 7.2-16 16-16zM32 224c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm576 0c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V240c0-8.8 7.2-16 16-16z"/>
                        </svg>
                        <button
                            class="flex h-10 w-10 p-1.5 rounded-md justify-center hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-red-500 transition-all"
                            @click="deleteSong(song.id)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 512" fill="currentColor" class="h-full items-center justify-center"
                            >
                                <path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.5 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div
                v-if="songs.length === 0"
                class="flex grow justify-center items-center"
            >
                <title-text>
                    <get-text :context="Lang.CreateTranslationContext('playlist', 'NoSongs')" />
                </title-text>
            </div>
        </div>
    </div>
</template>

<script>
import TitleText from '../../components/text/TitleText.vue';
import BaseText from '../../components/text/BaseText.vue';
import InputText from '../../components/inputs/InputText.vue';
import * as Ressources from '../../scripts/Ressources';
import GetText from '../../components/text/GetText.vue';
import Lang from '../../scripts/Lang';
import API from '../../scripts/API';
import Selector from '../../components/inputs/Selector.vue';
import EventManager from '../../scripts/EventManager';

export default {
    name: "PlaylistView",
    components: {
        TitleText,
        BaseText,
        InputText,
        Selector,
        GetText
    },
    data() {
        return {
            Lang,
            songs: [],
            playingId: null,
            dragging: false,
            dragTraget: null,
            lastFetchedSong: undefined,
            searchTimeout: null
        };
    },
    mounted() {
        window.addEventListener("mousemove", ev => {
            if (this.dragging) { this.doDrag(ev); }
        });
        window.addEventListener("mouseup", ev => {
            if (this.dragging) { this.stopDrag(ev); }
        });
        this.fetchSongs(5);
        this.$refs["song-selector"].attachInput(this.$el.querySelector('input[name=song-search]'));

        Ressources.getPlayer().then(player => {
            this.playingId = player.songId;
        });

        EventManager.Instance.addListener(this.onEvent);
    },
    methods: {
        async fetchSongs(nbSongs) {
            if (nbSongs <= 0) return;

            if (this.lastFetchedSong === undefined) {
                const playlist = await Ressources.getPlaylist();
                if (!playlist) return; // TODO : display error

                if (!playlist.headId) return; // no song in playlist

                this.lastFetchedSong = await Ressources.getSong(playlist.headId);
                if (!this.lastFetchedSong) return; // TODO : display error
                this.songs.push(this.lastFetchedSong);
            } else if (this.lastFetchedSong === null) {
                // end of playlist, stop
                return;
            } else {
                if (!this.lastFetchedSong.nextId) return;

                this.lastFetchedSong = await Ressources.getSong(this.lastFetchedSong.nextId);
                if (!this.lastFetchedSong) return; // TODO : display error
                this.songs.push(this.lastFetchedSong);
            }
            this.fetchSongs(nbSongs - 1);
        },
        startDrag(ev) {
            this.dragging = true;
            const songCard = this.getSongCard(ev.target);
            this.dragTraget = songCard;
            const targetRect = this.dragTraget.getBoundingClientRect();
            this.dragTraget.style.width = `${targetRect.width}px`;
            this.dragTraget.style.zIndex = `50`;
            this.dragTraget.classList.add("absolute");
            this.doDrag(ev);
        },
        stopDrag(ev) {
            if (!this.dragTraget) return;
            const mouse = {
                x: ev.clientX,
                y: ev.clientY
            };

            const container = this.$refs["songs-container"];
            const containerRect = container.getBoundingClientRect();
            const targetRect = this.dragTraget.getBoundingClientRect();

            this.dragging = false;
            this.dragTraget.classList.remove("absolute");
            this.dragTraget.style.width = `100%`;
            this.dragTraget.style.zIndex = `1`;
            for (let i = 0; i < playlist.length; i++) {
                const card = this.$refs["song-card"][i];
                card.classList.remove("transition-all");
                card.style.transform = "translateY(0)";
            }

            const dropIndex = Math.floor((mouse.y - containerRect.top) / targetRect.height - 0.5);
            const takeIndex = this.dragTraget.id.split("-")[1];

            this.dragTraget = null;
        },
        doDrag(ev) {
            if (!this.dragTraget) return;

            const mouse = {
                x: ev.clientX,
                y: ev.clientY
            };

            const container = this.$refs["songs-container"];
            const containerRect = container.getBoundingClientRect();
            
            const targetRect = this.dragTraget.getBoundingClientRect();
            this.dragTraget.style.top = `${mouse.y - containerRect.top - targetRect.height / 2}px`;

            const nbCardsToNotShift = Math.floor((mouse.y - containerRect.top) / targetRect.height - 0.5);
            let shift = 0;
            for (let i = 0; i < playlist.length; i++) {
                const card = this.$refs["song-card"][i];
                if (card === this.dragTraget) { shift = 1; continue; }
                if (i-shift < nbCardsToNotShift) {
                    card.style.transform = "translateY(0)";
                } else {
                    card.style.transform = "translateY(100%)";
                }
                if (!card.classList.contains("transition-all"))
                    setTimeout(() => {
                        card.classList.add("transition-all");
                    }, 10);
            }
        },
        getSongCard(el, depth = 0) {
            if (!el || depth > 8) { return null; }
            if (el.classList.contains("song-card")) {
                return el;
            } else {
                return this.getSongCard(el.parentElement, depth + 1);
            }
        },
        async onSongCompletion(selector, search) {
            const results = await API.execute_logged(API.ROUTE.SEARCH_SONG(search));
            selector.setData(results.data.splice(0, 5).map(song => ({
                value: song.title,
                desc: song.artist,
                img: song.cover,
                obj: song
            })));
        },
        async onSongSelected(song) {
            const stream = await API.execute_logged(API.ROUTE.STREAM_SONG(song.obj.id), API.METHOD.POST);

            const playlist = await Ressources.getPlaylist();

            const response = await API.execute_logged(API.ROUTE.PLAYLIST_SONGS(playlist.id), API.METHOD.POST, {
                ...song.obj,
                url: stream.data
            });
        },
        async playSong(id) {
            const player = await Ressources.getPlayer();
            const response = await API.execute_logged(API.ROUTE.PLAYERS_CHANGE(player.id), API.METHOD.POST, {
                songId: id
            });
            this.playingId = id;
        },
        async deleteSong(id) {
            const playlist = await Ressources.getPlaylist();
            const response = await API.execute_logged(API.ROUTE.PLAYLIST_SONG(playlist.id, id), API.METHOD.DELETE);
            this.songs = this.songs.filter(song => song.id !== id);
        },
        onEvent(ev) {
            switch (ev.type) {
            case 'playlist.added':
                this.onSongAdded(ev.data.song);
                break;
            case 'playlist.removed':
                this.onSongRemoved(ev.data.song);
                break;
            case 'player.changed':
                this.playingId = ev.data.song;
                break;
            default: break;
            }
        },
        async onSongAdded(id) {
            const song = await Ressources.getSong(id);
            if (!song) return; // TODO : display error
            if (this.songs.length > 1 && this.songs[this.songs.length - 1].id === song.id)
                return; // event already handled (own action)
            this.songs.push(song);
        },
        async onSongRemoved(id) {
            this.songs = this.songs.filter(song => song.id !== id);
        }
    }
}
</script>
