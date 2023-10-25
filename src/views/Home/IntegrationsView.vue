<template>
    <title-text class="mb-2 p-1 pb-2 border-b-2 border-slate-500 mb-6">
        <get-text :context="Lang.CreateTranslationContext('integrations', 'Title')" />
    </title-text>
    <div class="flex w-full mb-4 px-1 md:px-4">
        <div
            ref="tab-main"
            class="flex flex-col items-center w-full space-y-2 overflow-hidden transition-all"
        >
            <button
                v-for="int in integrations"
                :key="int.name"
                class="flex bg-slate-600 rounded-md border-2 border-transparent p-2 min-w-fit w-full
                       hover:border-slate-500 transition-all"
                @click="displaytab(int.name.toLowerCase())"
            >
                <div
                    v-if="int.path"
                    class="w-6"
                >
                    <svg
                        :viewBox="int.viewBox"
                        class="w-full h-full"
                    >
                        <path
                            :d="int.path"
                            fill="#fff"
                        />
                    </svg>
                </div>
                <p class="flex font-semibold pl-2 pr-8 md:pr-16">
                    {{ int.name }}
                </p>
                <div class="flex grow justify-end">
                    <chevron-right-icon class="w-6 h-6 text-slate-600 dark:text-slate-200" />
                </div>
            </button>
        </div>
        <div
            v-for="int in integrations"
            :key="int.name"
            :ref="'tab-' + int.name.toLowerCase()"
            class="flex items-center w-full h-full overflow-hidden transition-all"
            style="max-width: 0;"
        >
            <div class="flex flex-col min-w-fit w-full space-y-8 p-1">
                <div class="flex w-full h-full">
                    <button
                        class="flex bg-slate-600 rounded-md border-2 border-transparent p-1 hover:border-slate-500 transition-all"
                        @click="displaytab()"
                    >
                        <div class="flex">
                            <chevron-left-icon class="w-6 h-6 text-slate-600 dark:text-slate-200" />
                        </div>
                    </button>
                    <p class="flex grow text-lg font-semibold justify-center items-center bg-slate-200 dark:bg-slate-600 mx-1 rounded-md"> {{ int.name }} </p>
                </div>
                <component :is="int.comp" />
            </div>
        </div>
    </div>
</template>

<script>
import TitleText from '../../components/text/TitleText.vue';
import BaseText from '../../components/text/BaseText.vue';
import InputText from '../../components/inputs/InputText.vue';
import GetText from '../../components/text/GetText.vue';
import Lang from '../../scripts/Lang';
import DeezerView from './Integrations/DeezerView.vue';
import { markRaw } from 'vue';

import {
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/vue/24/outline';

export default {
    name: 'IntegrationsView',
    components: {
        TitleText,
        BaseText,
        InputText,
        GetText,
        ChevronRightIcon,
        ChevronLeftIcon
    },
    data() {
        return {
            Lang,
            integrations: [
                {
                    name: 'Deezer',
                    path: 'M451.46,244.71H576V172H451.46Zm0-173.89v72.67H576V70.82Zm0,275.06H576V273.2H451.46ZM0,447.09H124.54V374.42H0Zm150.47,0H275V374.42H150.47Zm150.52,0H425.53V374.42H301Zm150.47,0H576V374.42H451.46ZM301,345.88H425.53V273.2H301Zm-150.52,0H275V273.2H150.47Zm0-101.17H275V172H150.47Z',
                    viewBox: '0 0 576 512',
                    comp: markRaw(DeezerView)
                },
                {
                    name: 'Spotify',
                    path: 'M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z',
                    viewBox: '0 0 496 512'
                }
            ]
        }
    },
    mounted() {
        
    },
    methods: {
        displaytab(tab='main') {
            const tabs = this.integrations.map(int => int.name.toLowerCase()).concat(['main']);
            const index = tabs.indexOf(tab);
            for (let i = 0; i < tabs.length; i++) {
                const tab = this.$refs[`tab-${tabs[i]}`];
                const unique = Array.isArray(tab)? tab[0]: tab;
                unique.style.maxWidth = `${i === index? (
                    unique.firstElementChild.getBoundingClientRect().width
                ): 0}px`;
            }
        }
    }
}
</script>
