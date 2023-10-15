<template>
    <div class="flex grow flex-col min-h-full max-h-full h-fit max-w-full w-full">
        <div class="flex grow h-full max-h-full w-full h-[5em] justify-between items-center text-slate-400">
            <button
                class="md:hidden flex w-8 mx-4"
                :class="tab === 'room' ? 'text-slate-800 dark:text-white' : ''"
                @click="() => { tab = (tab === 'room' ? 'player' : 'room') }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    class="w-8"
                    fill="currentColor"
                >
                    <path d="M96 80a48 48 0 1 1 96 0A48 48 0 1 1 96 80zm128 0A80 80 0 1 0 64 80a80 80 0 1 0 160 0zm96 80a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 160a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm-58.7 64H378.7c54.2 0 98.4 42.5 101.2 96H160.1c2.8-53.5 47-96 101.2-96zm0-32C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7H485.3c14.7 0 26.7-11.9 26.7-26.7C512 411.7 452.3 352 378.7 352H261.3zM512 32a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm0 128A80 80 0 1 0 512 0a80 80 0 1 0 0 160zm16 64c44.2 0 80 35.8 80 80c0 8.8 7.2 16 16 16s16-7.2 16-16c0-61.9-50.1-112-112-112H444c2.6 10.2 4 21 4 32h80zm-336 0c0-11 1.4-21.8 4-32H112C50.1 192 0 242.1 0 304c0 8.8 7.2 16 16 16s16-7.2 16-16c0-44.2 35.8-80 80-80h80z"/>
                </svg>
            </button>
            <h2 class="md:flex hidden mx-auto text-2xl font-bold text-slate-700 dark:text-slate-200"> Room </h2>
            <icon-card
                class="flex w-fit mx-auto my-4"
                :class="tab === 'player' ? '' : 'hidden'"
            />
            <h2
                class="md:hidden flex mx-auto text-2xl font-bold text-slate-700 dark:text-slate-200"
                :class="tab === 'player' ? 'hidden' : ''"
            > {{ getTabText(tab) }} </h2>
            <h2 class="md:flex hidden mx-auto text-2xl font-bold text-slate-700 dark:text-slate-200"> Playlist </h2>
            <button
                class="md:hidden flex w-8 mx-4"
                :class="tab === 'playlist' ? 'text-slate-800 dark:text-white' : ''"
                @click="() => { tab = (tab === 'playlist' ? 'player' : 'playlist') }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    class="w-8"
                    fill="currentColor"
                >
                    <path xmlns="http://www.w3.org/2000/svg" d="M489.1 0C501.8 0 512 10.2 512 22.9V136c0 6.9-4.5 13.1-11.1 15.2L384 188.9V432c0 44.2-50.1 80-112 80s-112-35.8-112-80s50.1-80 112-80c31.3 0 59.7 9.2 80 24V56c0-6.9 4.4-13 10.9-15.2L481.9 1.2c2.3-.8 4.8-1.2 7.2-1.2zM332.6 401.5C318.3 391.3 297 384 272 384s-46.3 7.3-60.6 17.5C197.1 411.7 192 422.9 192 432s5.1 20.3 19.4 30.5C225.7 472.7 247 480 272 480s46.3-7.3 60.6-17.5C346.9 452.3 352 441.1 352 432s-5.1-20.3-19.4-30.5zM384 155.3l96-30.9V35.5l-96 32v87.8zM16 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H16C7.2 96 0 88.8 0 80s7.2-16 16-16zm0 128H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 128H144c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                </svg>
            </button>
        </div>
        <div
            v-if="isMobile"
            class="relative flex grow max-h-full min-h-0 w-full h-full"
        >
            <div
                class="absolute flex max-h-full w-full h-full left-0 bg-slate-50 dark:bg-slate-700 z-50 transition-all overflow-hidden"
                :class="tab === 'room' ? 'max-w-[100vw]' : 'max-w-[0vw]'"
            >
                <people class="flex max-h-full w-full h-full border-r-4 border-slate-200 dark:border-slate-600" />
            </div>
            <div
                class="flex max-h-full w-full h-full transition-all"
                :class="tab === 'player' ? '' : (tab === 'playlist' ? '-translate-x-8' : 'translate-x-8')"
            >
                <player class="flex max-h-full w-full h-full" />
            </div>
            <div
                class="absolute flex max-h-full w-full h-full right-0 bg-slate-50 dark:bg-slate-700 z-50 transition-all overflow-hidden"
                :class="tab === 'playlist' ? 'max-w-[100vw]' : 'max-w-[0vw]'"
            >
                <playlist class="flex max-h-full w-full h-full border-l-4 border-slate-200 dark:border-slate-600" />
            </div>
        </div>
        <div
            v-else
            class="flex w-full max-h-full min-h-0 h-full"
        >
            <people class="w-[30%] max-h-full min-h-0 h-full border-r-4 border-slate-200 dark:border-slate-600" />
            <player class="w-[40%] max-h-full min-h-0 h-full" />
            <playlist class="w-[30%] max-h-full min-h-0 h-full border-l-4 border-slate-200 dark:border-slate-600" />
        </div>
    </div>
</template>

<script>
import IconCard from '../components/cards/IconCard.vue';
import Player from "./Home/Player.vue";
import Playlist from "./Home/Playlist.vue";
import People from "./Home/Room.vue";

export default {
    name: "HomeView",
    components: {
        Player,
        Playlist,
        People,
        IconCard
    },
    data() {
        return {
            tab: 'player',
            isMobile: window.innerWidth < 768
        };
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    },
    methods: {
        getTabText(tab) {
            return {
                'player': 'VyBeen',
                'playlist': 'Playlist',
                'room': 'Room'
            }[tab];
        }
    }
}
</script>