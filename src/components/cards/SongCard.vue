<template>
    <div
        v-if="song.id === undefined || song.id === null"
        class="flex song-card justify-between items-center w-full md:h-20 h-[4.5em] my-2"
    >
        <div
            class="flex md:w-16 w-12 h-16 md:p-4 p-2 items-center justify-center text-slate-500 transition-all"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="h-full items-center justify-center"
            >
                <path xmlns="http://www.w3.org/2000/svg" d="M352 192a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm-160 0a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM64 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zM224 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM32 320a32 32 0 1 0 64 0 32 32 0 1 0 -64 0z"/>
            </svg>
        </div>
        <div
            class="flex justify-center w-full h-full text-4xl text-slate-400 border-b-4 border-2 rounded-lg bg-white dark:bg-slate-700 p-2 p-2 border-slate-200/[0.5] dark:border-slate-800/[0.5]"
        >
            <p class="mx-2 wowow-h" style="animation-delay: 000ms">.</p>
            <p class="mx-2 wowow-h" style="animation-delay: 200ms">.</p>
            <p class="mx-2 wowow-h" style="animation-delay: 400ms">.</p>
        </div>
    </div>
    <div
        v-else
        class="flex song-card justify-between items-center w-full md:h-20 h-[4.5em] my-2"
    >
        <button
            class="flex md:w-16 w-12 h-16 md:p-4 p-2 items-center justify-center text-slate-500 cursor-grab hover:text-slate-400 transition-all"
            @mousedown="startDrag"
            @mouseup="stopDrag"
            @touchstart="startDrag"
            @touchend="stopDrag"
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
</template>

<script>
import BaseText from '../text/BaseText.vue'
import TitleText from '../text/TitleText.vue'
export default {
    name: 'SongCard',
    components: {
        TitleText,
        BaseText
    },
    props: {
        song: {
            type: Object,
            required: true
        },
        startDrag: {
            type: Function,
            required: true
        },
        stopDrag: {
            type: Function,
            required: true
        },
        deleteSong: {
            type: Function,
            required: true
        },
        playSong: {
            type: Function,
            required: true
        },
        playingId: {
            type: Number,
            required: false,
            default: null
        }
    },
    mounted() {
        this.song.registerView?.(this);
    },
    methods: {
        
    }
}
</script>

<style scoped>
@keyframes wowow-h {
    0%, 100% { transform: translateY(0); }
    33% { transform: translateY(5%); }
    66% { transform: translateY(-5%); }
}

.wowow-h {
    animation: wowow-h 1s ease-in-out infinite;
}
</style>