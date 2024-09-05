<template>
    <div class="flex flex-col items-center">
        <div class="flex w-full py-2 px-4 space-x-2">
            <div class="flex flex-col w-full">
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
            <button
                class="m-auto py-1 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-md transition-all"
                @click="openIntegrations"
            >
                <ellipsis-vertical-icon class="text-slate-800 dark:text-slate-200 w-6" />
            </button>
        </div>
        <div class="flex w-full h-fit px-4">
            <span class="w-full rounded-full h-1 bg-slate-200 dark:bg-slate-600" />
        </div>
        <div
            ref="songs-container"
            class="relative flex flex-col h-full w-full overflow-x-hidden overflow-h-auto px-4 py-2"
        >
            <song-card
                v-for="(song, index) in songs"
                :id="'song-'+index"
                :key="song"
                :song="song"
                :delete-song="deleteSong"
                :play-song="playSong"
                :start-drag="startDrag"
                :stop-drag="stopDrag"
                :playing-id="playingId"
            />
            <div
                v-if="songs.length === 0"
                class="flex grow justify-center items-center"
            >
                <title-text>
                    <get-text :context="Lang.CreateTranslationContext('playlist', 'NoSongs')" />
                </title-text>
            </div>
        </div>
        <modal-card ref="modal-card">
            <integrations-view ref="integrations" />
        </modal-card>
    </div>
</template>

<script>
import TitleText from '../../components/text/TitleText.vue';
import InputText from '../../components/inputs/InputText.vue';
import * as Ressources from '../../scripts/Ressources';
import GetText from '../../components/text/GetText.vue';
import Lang from '../../scripts/Lang';
import API from '../../scripts/API';
import Selector from '../../components/inputs/Selector.vue';
import EventManager from '../../scripts/EventManager';
import ModalCard from '../../components/cards/ModalCard.vue';
import User from '../../scripts/User';
import IntegrationsView from './IntegrationsView.vue';

import {
    EllipsisVerticalIcon
} from '@heroicons/vue/24/outline';
import SongCard from '../../components/cards/SongCard.vue';

export default {
    name: "PlaylistView",
    components: {
        TitleText,
        InputText,
        Selector,
        GetText,
        EllipsisVerticalIcon,
        ModalCard,
        IntegrationsView,
        SongCard
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
        window.addEventListener("mousemove", ev => { if (this.dragging) { this.doDrag(ev); } });
        window.addEventListener("touchmove", ev => { if (this.dragging) { this.doDrag(ev); } });

        window.addEventListener("mouseup",  ev => { if (this.dragging) { this.stopDrag(ev); } });
        window.addEventListener("touchend", ev => { if (this.dragging) { this.stopDrag(ev); } });

        this.fetchSongs(64);
        this.$refs["song-selector"].attachInput(this.$el.querySelector('input[name=song-search]'));

        Ressources.getPlayer().then(player => {
            this.playingId = player.songId;
        });

        EventManager.Instance.addListener(this.onEvent);

        window.Playlist = this;
        window.IntegrationPopup = this.$refs['modal-card'];
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
        async stopDrag(ev) {
            if (!this.dragTraget) return;
            const mouse = {
                x: ev.clientX ?? ev.changedTouches[0].clientX,
                y: ev.clientY ?? ev.changedTouches[0].clientY
            };

            const container = this.$refs["songs-container"];
            const containerRect = container.getBoundingClientRect();
            const targetRect = this.dragTraget.getBoundingClientRect();

            this.dragging = false;
            this.dragTraget.classList.remove("absolute");
            this.dragTraget.style.width = `100%`;
            this.dragTraget.style.zIndex = `1`;
            for (let i = 0; i < this.songs.length; i++) {
                const card = this.$refs["song-card"][i]; // TODO : get from dom ID (else bugs when updated)
                card.classList.remove("transition-all");
                card.style.transform = "translateY(0)";
            }

            const dropIndex = Math.min(
                Math.max(
                    Math.floor((mouse.y - containerRect.top) / targetRect.height - 0.5),
                    0
                ),
                this.songs.length - 1
            );
            const takeIndex = this.dragTraget.id.split("-")[1];
            if (dropIndex == takeIndex) return;

            const movedSongId = this.songs[takeIndex].id;
            const prevSongId = this.songs[dropIndex + (takeIndex<dropIndex?0:-1)]?.id ?? null;
            API.execute_logged(API.ROUTE.PLAYLIST_SONG((await Ressources.getPlaylist()).id, movedSongId), API.METHOD.PATCH, {
                prevId: prevSongId
            }).then(res => {
                this.songs.splice(dropIndex, 0, this.songs.splice(takeIndex, 1)[0]);
            }).catch(err => {

            });

            this.dragTraget = null;
        },
        doDrag(ev) {
            if (!this.dragTraget) return;

            const mouse = {
                x: ev.clientX ?? ev.touches[0].clientX,
                y: ev.clientY ?? ev.touches[0].clientY
            };

            const container = this.$refs["songs-container"];
            const containerRect = container.getBoundingClientRect();
            
            const targetRect = this.dragTraget.getBoundingClientRect();
            this.dragTraget.style.top = `${mouse.y - containerRect.top - targetRect.height / 2}px`;

            const nbCardsToNotShift = Math.floor((mouse.y - containerRect.top) / targetRect.height - 0.5);
            let shift = 0;
            for (let i = 0; i < this.songs.length; i++) {
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
            const results = await API.execute_logged(API.ROUTE.SEARCH_SONG(btoa(search)));
            selector.setData(results.data.map(song => ({
                value: song.title,
                desc: song.artist,
                img: song.cover,
                obj: song
            })));
        },
        async onSongSelected(song) {
            if (!song) return;

            const addedSong = {
                id: null,
                view: null,
                registerView: (view) => { addedSong.view = view; }
            };
            this.songs.push(addedSong);

            const stream = await API.execute_logged(API.ROUTE.STREAM_SONG(song.obj.id), API.METHOD.POST);

            const playlist = await Ressources.getPlaylist();

            const response = await API.execute_logged(API.ROUTE.PLAYLIST_SONGS(playlist.id), API.METHOD.POST, {
                ...song.obj,
                url: stream.data
            });
            
            for (const key in response.data) {
                addedSong[key] = response.data[key];
            }
            addedSong.view?.$forceUpdate();
        },
        async playSong(id) {
            const player = await Ressources.getPlayer();
            const response = await API.execute_logged(API.ROUTE.PLAYERS_CHANGE(player.id), API.METHOD.POST, {
                songId: id
            });
            this.playingId = id;
        },
        async deleteSong(id) {
            const song = this.songs.find(s => s.id === id);
            song.id = undefined;
            const playlist = await Ressources.getPlaylist();
            try {
                const response = await API.execute_logged(API.ROUTE.PLAYLIST_SONG(playlist.id, id), API.METHOD.DELETE);
                this.songs = this.songs.filter(song => song.id !== undefined);
            } catch (err) {
                song.id = id;
            }
        },
        onEvent(ev) {
            switch (ev.type) {
            case 'playlist.added':
                this.onSongAdded(ev.data.song);
                break;
            case 'playlist.removed':
                this.onSongRemoved(ev.data.song);
                break;
            case 'playlist.moved':
                if (ev.data.user === User.CurrentUser.id) return;
                const songIndex = this.songs.findIndex(song => song.id === ev.data.song);
                const prevIndex = this.songs.findIndex(song => song.id === ev.data.prev);
                this.songs.splice(prevIndex + (songIndex>prevIndex?1:0), 0, this.songs.splice(songIndex, 1)[0]);
                break;
            case 'player.changed':
            case 'player.nexted':
            case 'player.preved':
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
        },
        openIntegrations() {
            this.$refs['modal-card'].open();
            this.$refs['integrations'].displaytab();
        }
    }
}
</script>
