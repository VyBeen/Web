<template>
    <div class="flex flex-col w-full min-w-[16em] h-fit">
        <input-text
            name="deezer-user-id"
            :label="'User ID'"
            :placeholder="'Enter your Deezer User ID'"
        />
        <div class="flex flex-col space-y-2">
            <button
                v-for="opt in options"
                :key="opt.name"
                class="flex bg-slate-600 rounded-md border-2 border-transparent p-2 min-w-fit w-full
                       hover:border-slate-500 transition-all"
                @click="opt.callback"
            >
                <p class="flex font-semibold pr-8">
                    {{ opt.name }}
                </p>
                <div class="flex grow justify-end">
                    <chevron-right-icon class="w-6 h-6 text-slate-600 dark:text-slate-200" />
                </div>
            </button>
        </div>
    </div>
</template>

<script>
import InputText from '../../../components/inputs/InputText.vue';
import User from '../../../scripts/User';
import * as Ressources from '../../../scripts/Ressources';

import {
    ChevronRightIcon
} from '@heroicons/vue/24/outline';

async function doRequest(url) {
    const based64 = btoa(url);
    console.log('link is ' + ('http://localhost:8080/request?url=' + based64));
    const link = encodeURI('http://localhost:8080/request?url=' + based64);
    console.log('request to ' + link);
    const response = await fetch(link, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': User.CurrentUser.token
        }
    });
    return await response.json();
}

export default {
    name: 'DeezerView',
    components: {
        InputText,
        ChevronRightIcon
    },
    data() {
        return {
            options: [
                {
                    name: 'Add first song of Flow',
                    callback: () => {
                        const userId = document.querySelector('input[name="deezer-user-id"]').value;
                        const url = `https://api.deezer.com/user/${userId}/flow`;
                        console.log("Getting flow songs ...");
                        doRequest(url).then(async res => {
                            const songs = res.data;
                            if (!songs) {
                                console.log("No songs found");
                                return;
                            }
                            const firstSong = songs[0];
                            const songSearch = firstSong.artist.name + ' - ' + firstSong.title;
                            
                            console.log("Searching for [" + songSearch + "] ...");
                            const search = await API.execute_logged(API.ROUTE.SEARCH_SONG(btoa(songSearch)));
                            const song = search.data[0];
                            console.log("Adding song [" + song.title + "] ...");
                            const stream = await API.execute_logged(API.ROUTE.STREAM_SONG(song.id), API.METHOD.POST);
                            await API.execute_logged(API.ROUTE.PLAYLIST_SONGS((await Ressources.getPlaylist()).id), API.METHOD.POST, {
                                ...song,
                                url: stream.data
                            });
                        });
                    }
                }
            ]
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>
