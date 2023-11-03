<template>
    <div class="flex flex-col justify-evenly items-center">
        <canvas id="coverGenerator" class="hidden" />
        <div class="hidden">
            <audio ref="audio-source" />
        </div>
        <div class="flex flex-col items-center w-full space-y-4"> <!-- PREVIEW -->
            <div class="relative md:w-60 md:h-60 w-48 h-48 rounded-full bg-slate-200 dark:bg-slate-800">
                <canvas 
                    ref="progress-canvas"
                    class="absolute w-full h-full rounded-full"
                    style="transform: rotate(-90deg)"
                />
                <div
                    ref="song-slider"
                    class="absolute flex w-full h-full p-2"
                >
                    <div class="flex w-full h-full rounded-full bg-white dark:bg-slate-700 p-2">
                        <div class="flex object-cover w-full h-full rounded-full bg-green-500/[0.1] justify-center items-center">
                            <img
                                :src="coverSrc"
                                alt=" "
                                class="flex w-full h-full object-cover rounded-full animate-roll items-center justify-center drag-none"
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex w-fit h-fit space-x-10">
                <base-text> {{ displayedProgress }} </base-text>
                <base-text> / </base-text>
                <base-text> {{ displayedLength }} </base-text>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="flex flex-col w-full justify-center items-center my-10"> <!-- TEXTS -->
                <title-text class="w-fit text-center"> {{ title }} </title-text>
                <base-text class="w-fit text-center"> {{ artist }} </base-text>
            </div>
            <div class="flex w-full justify-center items-center space-x-10"> <!-- CONTROLS -->
                <button
                    class="flex p-2 w-14 h-14 rounded-lg justify-center items-center transition-all"
                    :class="prevState === STATE.OK ? 'text-green-500 hover:text-green-400' : 'text-green-600/[0.5] cursor-default'"
                    @click="() => { if (prevState === STATE.OK) onPrevClicked(); }"
                >
                    <svg
                        v-if="prevState !== STATE.LOADING"
                        xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill="currentColor"
                    >
                        <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/>
                    </svg>
                    <svg
                        v-if="prevState === STATE.LOADING"
                        xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512" fill="currentColor" class="items-center justify-center animate-spin"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M224 32c0-17.7 14.3-32 32-32C397.4 0 512 114.6 512 256c0 46.6-12.5 90.4-34.3 128c-8.8 15.3-28.4 20.5-43.7 11.7s-20.5-28.4-11.7-43.7c16.3-28.2 25.7-61 25.7-96c0-106-86-192-192-192c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
                <button
                    class="flex p-2 w-14 h-14 rounded-lg justify-center items-center text-white dark:text-slate-700 transition-all border-b-4 border-2"
                    :class="playState === STATE.LOADING ? 'bg-green-700 border-green-900 cursor-default' : 'bg-green-500 border-green-700 hover:bg-green-400 hover:border-green-600'"
                    @click="() => { if (state !== STATE.LOADING) onPlayClicked(); }"
                >
                    <svg
                        v-if="playState === STATE.PAUSED"
                        xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 385 512" fill="currentColor" class="items-center justify-center"
                    >
                        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                    </svg>
                    <svg
                        v-if="playState === STATE.PLAYING"
                        xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" fill="currentColor" class="items-center justify-center"
                    >
                        <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
                    </svg>
                    <svg
                        v-if="playState === STATE.LOADING"
                        xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512" fill="currentColor" class="items-center justify-center animate-spin"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M224 32c0-17.7 14.3-32 32-32C397.4 0 512 114.6 512 256c0 46.6-12.5 90.4-34.3 128c-8.8 15.3-28.4 20.5-43.7 11.7s-20.5-28.4-11.7-43.7c16.3-28.2 25.7-61 25.7-96c0-106-86-192-192-192c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
                <button
                    class="flex p-2 w-14 h-14 rounded-lg justify-center items-center transition-all"
                    :class="nextState === STATE.OK ? 'text-green-500 hover:text-green-400' : 'text-green-600/[0.5] cursor-default'"
                    @click="() => { if (nextState === STATE.OK) onNextClicked(); }"
                >
                    <svg
                        v-if="nextState !== STATE.LOADING"
                        xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill="currentColor"
                    >
                        <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/>
                    </svg>
                    <svg
                        v-if="nextState === STATE.LOADING"
                        xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512" fill="currentColor" class="items-center justify-center animate-spin"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M224 32c0-17.7 14.3-32 32-32C397.4 0 512 114.6 512 256c0 46.6-12.5 90.4-34.3 128c-8.8 15.3-28.4 20.5-43.7 11.7s-20.5-28.4-11.7-43.7c16.3-28.2 25.7-61 25.7-96c0-106-86-192-192-192c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import TitleText from '../../components/text/TitleText.vue';
import BaseText from '../../components/text/BaseText.vue';
import * as Ressources from '../../scripts/Ressources';
import API from '../../scripts/API';
import EventManager from '../../scripts/EventManager';
import User from '../../scripts/User';

const STATE = {
    PLAYING: "playing",
    PAUSED: "paused",
    LOADING: "loading",
    OK: "ok",
    DISABLED: "disabled"
};

export default {
    name: "PlayerView",
    components: {
        TitleText,
        BaseText
    },
    data() {
        return {
            canvas: null,
            ctx: null,
            progressSpeed: 3,
            playState: STATE.LOADING,
            nextState: STATE.OK,
            prevState: STATE.OK,
            STATE,
            artist: "- - - - -",
            title: "- - - - - -",
            coverSrc: "",
            length: 0,
            cursorDate: new Date(),
            position: 0,
            displayedProgress: "-- : --",
            displayedLength: "-- : --"
        };
    },
    mounted() {
        this.startCanvasRender();

        EventManager.Instance.addListener(this.onEvent);
        
        this.displayedProgress = this.getDisplayTime(this.getProgressInSeconds());
        this.displayedLength = this.getDisplayTime(this.length);
        setInterval(() => {
            this.displayedProgress = this.getDisplayTime(this.getProgressInSeconds());
            this.displayedLength = this.getDisplayTime(this.length);
        }, 100);

        const songSlider = this.$refs['song-slider'];
        let lastPosition = 0;
        songSlider.addEventListener('touchstart', ev => { lastPosition = ev.touches[0].clientX; });
        songSlider.addEventListener('touchmove', ev => {
            const progress = this.calculatePosition() / this.length;
            const delta = (ev.touches[0].clientX - lastPosition) / (songSlider.clientWidth * 4);
            this.position = (progress + delta) * this.length;
            this.cursorDate = new Date();
            lastPosition = ev.touches[0].clientX;
        });
        songSlider.addEventListener('touchend', ev => {
            const progress = this.calculatePosition() / this.length;
            const audioSource = this.getAudioSource();
            const time = progress * audioSource.duration;
            audioSource.setEventFlag();
            audioSource.currentTime = time;
        });

        const promises = [
            this.fetchPlayerInformations(),
            this.fetchPlayerSong()
        ];
        Promise.all(promises).then(() => {
            const audioSource = this.getAudioSource();
            let firstEvent = true;
            let askingForPlay = true;
            window.addEventListener('mousedown', ev => {
                if (!askingForPlay) return;
                Ressources.getPlayer().then(player => {
                    if (player.playing) {
                        audioSource.unsetEventFlag();
                        audioSource.play();
                    }
                })
            });
            audioSource.addEventListener("canplay", ev => {
                this.length = audioSource.duration;
            });
            audioSource.addEventListener("playing", ev => {
                askingForPlay = false;
                if (!firstEvent) return;
                firstEvent = false;
                audioSource.unsetEventFlag();
                audioSource.currentTime = this.getProgressInSeconds();
            });
            this.loadSongStream();

            audioSource.addEventListener('ended', async ev => {
                const room = await Ressources.getRoom();
                const userId = User.CurrentUser.id;

                if (room.ownerId === userId) {
                    this.onNextClicked();
                } else {
                    const owner = await Ressources.getUser(room.ownerId);
                    if (!owner.connected) {
                        const users = await API.execute_logged(API.ROUTE.ROOMUSERS(User.CurrentUser.roomId));
                        if (users.data.items.length < 0 || users.data.items[0].id === User.CurrentUser.id) {
                            this.onNextClicked();
                        }
                    }
                }
            });
        }).catch(err => {
            console.error(err); // TODO : display error
        });
    },
    methods: {
        async loadSongStream() {
            const audioSource = this.getAudioSource();
            const player = await Ressources.getPlayer();
            if (!player.songId) return;

            const song = await Ressources.getSong(player.songId);
            if (!song) return; // TODO : display error
            this.getAudioSource().src = API.API_URL + song.url;
            if (player.playing) {
                audioSource.unsetEventFlag();
                audioSource.play();
            }
        },
        calculatePosition() {
            return this.position + (new Date() - this.cursorDate) / 1000;
        },
        getProgressInSeconds() {
            return Math.max(
                Math.min(
                    this.getAudioSource()?.paused
                        ? this.position
                        : this.calculatePosition(),
                    this.length
                ),
                0
            ) ?? 0;
        },
        async fetchPlayerInformations() {
            const player = await Ressources.getPlayer(true);
            if (!player) return; // TODO : display error

            const audioSource = this.getAudioSource();
            audioSource.addEventListener('play', ev => {
                this.playState = STATE.PLAYING;
                if (!ev.target.hasEventFlag()) return;
                API.execute_logged(API.ROUTE.PLAYERS(player.id, "play"), API.METHOD.POST);
            });
            audioSource.addEventListener('pause', ev => {
                this.playState = STATE.PAUSED;
                if (!ev.target.hasEventFlag()) return;
                API.execute_logged(API.ROUTE.PLAYERS(player.id, "pause"), API.METHOD.POST);
            });
            audioSource.addEventListener('seeking', ev => {
                if (!ev.target.hasEventFlag()) return;
                API.execute_logged(API.ROUTE.PLAYERS(player.id, "move"), API.METHOD.POST, {
                    position: ev.target.currentTime
                });
            });

            this.playState = player.playing ? STATE.PLAYING : STATE.PAUSED;
            this.position = player.position;
            this.cursorDate = player.cursorDate;
        },
        async fetchPlayerSong() {
            const player = await Ressources.getPlayer();
            if (!player) return; // TODO : display error

            if (!player.songId) return; // no song playing

            const song = await Ressources.getSong(player.songId);
            if (!song) return; // TODO : display error
            
            this.title = song.title;
            this.artist = song.artist;
            this.coverSrc = song.cover;
            this.getAudioSource().src = song.url;

            const canvas = document.getElementById("coverGenerator");
            canvas.width = 256;
            canvas.height = 256;
            document.body.appendChild(canvas);

            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                artwork: [
                    { src: song.cover, sizes: '256x256', type: 'image/jpg' }
                ]
            });
            navigator.mediaSession.setActionHandler('nexttrack', ev => {
                this.onNextClicked();
            });
            navigator.mediaSession.setActionHandler('previoustrack', ev => {
                this.onPrevClicked();
            });
        },
        getDisplayTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes < 10 ? "0" : ""}${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
        },
        onPlayClicked() {
            const oldState = this.playState;
            this.playState = STATE.LOADING;
            this.getAudioSource().setEventFlag();
            this.getAudioSource()[oldState === STATE.PLAYING ? "pause" : "play"]();
        },
        async onNextClicked() {
            this.nextState = STATE.LOADING;
            const player = await Ressources.getPlayer();
            if (!player) return; // TODO : display error
            API.execute_logged(API.ROUTE.PLAYERS(player.id, "next"), API.METHOD.POST)
                .then(() => {})
                .catch(err => console.error(err))
                .finally(() => this.nextState = STATE.OK);
        },
        async onPrevClicked() {
            this.prevState = STATE.LOADING;
            const player = await Ressources.getPlayer();
            if (!player) return; // TODO : display error
            API.execute_logged(API.ROUTE.PLAYERS(player.id, "prev"), API.METHOD.POST)
                .then(() => {})
                .catch(err => console.error(err))
                .finally(() => this.prevState = STATE.OK);
        },
        startCanvasRender() {
            const resizeCanvas = () => {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
            };

            if (!this.canvas) {
                this.canvas = this.$refs["progress-canvas"];
                resizeCanvas();
                window.addEventListener("resize", resizeCanvas);
            }
            if (!this.ctx) {
                this.ctx = this.canvas.getContext("2d");
            }

            const lineWidth = 8;
            const startAngle = 0;
            let endAngle =  0;

            let lastTime = Date.now();
            const render = () => {
                const now = Date.now();
                const delta = now - lastTime;
                lastTime = now;

                const ACCENT_COLOR = "#22c55e";

                const radius = this.canvas.width / 2;
                const progress = this.length > 0
                    ? this.getProgressInSeconds() / this.length
                    : 0;
                const targetAngle = 2 * Math.PI * progress;
                endAngle += (targetAngle - endAngle) * Math.min((delta / 1000) * this.progressSpeed, 1);

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.beginPath();
                try {
                    this.ctx.arc(
                        radius,
                        radius,
                        radius - lineWidth / 2,
                        startAngle,
                        endAngle,
                    );
                } catch (err) {}
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = ACCENT_COLOR;
                this.ctx.stroke();
                this.ctx.closePath();

                const endPos = {
                    x: radius + (radius - lineWidth / 2) * Math.cos(endAngle),
                    y: radius + (radius - lineWidth / 2) * Math.sin(endAngle)
                };
                this.ctx.fillStyle = ACCENT_COLOR;
                this.ctx.beginPath();
                this.ctx.arc(endPos.x, endPos.y, lineWidth / 2, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                const startPos = {
                    x: radius + (radius - lineWidth / 2) * Math.cos(startAngle),
                    y: radius + (radius - lineWidth / 2) * Math.sin(startAngle)
                };
                this.ctx.fillStyle = ACCENT_COLOR;
                this.ctx.beginPath();
                this.ctx.arc(startPos.x, startPos.y, lineWidth / 2, 0, 2 * Math.PI);
                this.ctx.fill();

                window.requestAnimationFrame(render);
            }

            render();
        },
        /**@returns {HTMLAudioElement} */
        getAudioSource() {
            const source = this.$refs["audio-source"];
            if (!source) return null;

            if (!source.hasEventFlag) {
                source.hasEventFlag = () => {
                    const res = source.eventFlag;
                    source.eventFlag = Math.max(source.eventFlag - 1, 0);
                    return res > 0;
                }
                source.unsetEventFlag = () => {
                    source.eventFlag = 0;
                }
                source.setEventFlag = () => {
                    source.eventFlag ++;
                }
            }
            return source;
        },
        async onEvent(ev) {
            const typeSplit = ev.type.split(".");
            if (typeSplit.length < 2 || typeSplit[0] !== 'player') return;

            const type = typeSplit[1];
            const audioSource = this.getAudioSource();
            if (!audioSource) return;

            switch (type) {
            case 'moved':
                this.position = ev.data.position;
                this.cursorDate = new Date(ev.data.cursorDate);
                audioSource.unsetEventFlag();
                audioSource.currentTime = this.getProgressInSeconds();
                break;
            case 'played':
                this.position = ev.data.position;
                this.cursorDate = new Date(ev.data.cursorDate);
                audioSource.unsetEventFlag();
                audioSource.currentTime = this.getProgressInSeconds();
                if (!audioSource.paused) break;
                audioSource.unsetEventFlag();
                audioSource.play();
                break;
            case 'paused':
                this.position = ev.data.position;
                this.cursorDate = new Date(ev.data.cursorDate);
                audioSource.unsetEventFlag();
                audioSource.currentTime = this.getProgressInSeconds();
                if (audioSource.paused) break;
                audioSource.unsetEventFlag();
                audioSource.pause();
                break;
            case 'changed':
            case 'nexted':
            case 'preved':
                await this.fetchPlayerInformations();
                await this.fetchPlayerSong();
                await this.loadSongStream();
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

<style scoped>
@keyframes roll {
    0%, 100% {
        transform: rotate(-6deg);
    }
    50% {
        transform: rotate(6deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
.animate-roll {
    animation: roll 8s ease infinite alternate;
}

.shadow-hover {
    box-shadow: 0px 0px 10px #22c55e40;
}
</style>