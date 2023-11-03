<template>
    <div class="flex flex-col w-full min-w-[16em] h-fit text-slate-700 dark:text-slate-200">
        <input-text
            name="deezer-user-id"
            :label="'User ID'"
            :placeholder="'Enter your Deezer User ID'"
        />
        <a
            class="italic m-0 p-0 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-500 hover:underline transition-all"
            href="https://support.deezer.com/hc/en-gb/articles/115004530369-Find-Your-Deezer-User-ID"
            target="_blank"
        >
            What is my Deezer User ID ?
        </a>
        <div class="flex flex-col space-y-2 mt-4">
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
        <log-zone ref="log-zone" />
    </div>
</template>

<script>
import InputText from '../../../components/inputs/InputText.vue';
import LogZone from '../../../components/cards/LogZone.vue';
import User from '../../../scripts/User';

import {
    ChevronRightIcon
} from '@heroicons/vue/24/outline';
import API from '../../../scripts/API';
import { Log } from '../../../scripts/Logs';

async function doRequest(url) {
    const based64 = btoa(url);
    const link = encodeURI(import.meta.env.VITE_API_HOST + '/request?url=' + based64);
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
        ChevronRightIcon,
        LogZone
    },
    data() {
        return {
            options: [
                {
                    name: 'Add first song of Flow',
                    callback: () => {
                        const log = this.$refs['log-zone'].log('Getting Deezer Flow informations ...', Log.INFO);
                        const userId = document.querySelector('input[name="deezer-user-id"]').value;
                        const url = `https://api.deezer.com/user/${userId}/flow`;

                        console.log("Getting flow songs ...");
                        doRequest(url).then(async res => {
                            const songs = res.data;
                            if (!songs) {
                                log.update('Woops, no songs found !');
                                setTimeout(() => {
                                    log.delete();
                                }, 4000);
                                return;
                            }

                            const firstSong = songs[0];
                            const songSearch = firstSong.artist.name + ' - ' + firstSong.title;
                            
                            log.update('Searching for [' + songSearch + '] ...');
                            const search = await API.execute_logged(API.ROUTE.SEARCH_SONG(btoa(songSearch)));
                            const song = search.data[0];

                            log.update('Adding song [' + song.title + '] ...');
                            window.Playlist.onSongSelected({obj: song});
                            setTimeout(() => {
                                window.IntegrationPopup.close();
                                log.delete();
                            }, 2000);
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
