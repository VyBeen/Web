<template>
    <div class="flex flex-col justify-evenly items-center">
        <div class="flex flex-col w-full p-4 space-y-4">
            <div class="flex justify-center items-center space-x-4">
                <div
                    v-if="editingName"
                    class="flex w-32 h-14 items-center"
                >
                    <input-text
                        :value="name"
                        @input="name = $event.target.value"
                    />
                </div>
                <title-text
                    v-else
                    class="flex h-14 w-fit items-center text-center"
                > {{ name }} </title-text>
                <button
                    class="flex h-10 w-10 p-1.5 rounded-md justify-center hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-green-500 transition-all"
                    @click="editingName = !editingName"
                >
                    <svg
                        v-if="!editingName"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
                        class="h-full items-center justify-center w-full"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M454.6 45.3l12.1 12.1c12.5 12.5 12.5 32.8 0 45.3L440 129.4 382.6 72l26.7-26.7c12.5-12.5 32.8-12.5 45.3 0zM189 265.6l171-171L417.4 152l-171 171c-4.2 4.2-9.6 7.2-15.4 8.6l-65.6 15.1L180.5 281c1.3-5.8 4.3-11.2 8.6-15.4zm197.7-243L166.4 243c-8.5 8.5-14.4 19.2-17.1 30.9l-20.9 90.6c-1.2 5.4 .4 11 4.3 14.9s9.5 5.5 14.9 4.3l90.6-20.9c11.7-2.7 22.4-8.6 30.9-17.1L489.4 125.3c25-25 25-65.5 0-90.5L477.3 22.6c-25-25-65.5-25-90.5 0zM80 64C35.8 64 0 99.8 0 144V432c0 44.2 35.8 80 80 80H368c44.2 0 80-35.8 80-80V304c0-8.8-7.2-16-16-16s-16 7.2-16 16V432c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48H208c8.8 0 16-7.2 16-16s-7.2-16-16-16H80z"/>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"
                        class="h-full items-center justify-center w-full"
                    >
                        <path xmlns="http://www.w3.org/2000/svg" d="M443.3 100.7c6.2 6.2 6.2 16.4 0 22.6l-272 272c-6.2 6.2-16.4 6.2-22.6 0l-144-144c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L160 361.4 420.7 100.7c6.2-6.2 16.4-6.2 22.6 0z"/>
                    </svg>
                </button>
            </div>
            <div class="flex justify-between">
                <button-text> <get-text :context="Lang.CreateTranslationContext('room', 'ChangeRoom')" /> </button-text>
                <button-block color="green">
                    <get-text :context="Lang.CreateTranslationContext('room', 'InviteInRoom')" /> 
                </button-block>
            </div>
        </div>
        <div class="flex w-full h-fit px-4">
            <span class="w-full rounded-full h-1 bg-slate-200 dark:bg-slate-600" />
        </div>
        <div class="flex flex-col max-h-full min-h-0 h-full w-full overflow-x-hidden overflow-h-auto px-4 py-2">
            <div class="flex flex-col h-fit">
                <div class="flex justify-between items-center w-full md:h-20 h-[4.5em] my-2">
                    <div
                        class="flex w-full h-full border-b-4 border-2 rounded-lg bg-white dark:bg-slate-700 p-2 border-slate-100 dark:border-slate-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" fill="currentColor"
                            class="h-full items-center justify-center text-slate-400 w-8 mx-3"
                        >
                            <path xmlns="http://www.w3.org/2000/svg" d="M320 128a96 96 0 1 0 -192 0 96 96 0 1 0 192 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM32 480H416c-1.2-79.7-66.2-144-146.3-144H178.3c-80 0-145 64.3-146.3 144zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                        </svg>
                        <div class="flex items-center w-full overflow-hidden">
                            <title-text class="w-fit text-center"> {{ User.CurrentUser.pseudo }} </title-text>
                        </div>
                        <div class="flex w-fit h-full items-center justify-end text-slate-400 space-x-2">
                            <button
                                class="flex h-10 w-10 p-1.5 rounded-md justify-center hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-red-500 transition-all"
                                @click="disconnect"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="h-full items-center justify-center"
                                >
                                    <path d="M507.3 267.3c6.2-6.2 6.2-16.4 0-22.6l-128-128c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L457.4 240 176 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l281.4 0L356.7 372.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l128-128zM176 64c8.8 0 16-7.2 16-16s-7.2-16-16-16L80 32C35.8 32 0 67.8 0 112L0 400c0 44.2 35.8 80 80 80l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48l96 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    v-for="(user, index) in people.filter((user) => user.id !== User.CurrentUser.id)"
                    :key="user"
                    class="flex justify-between items-center w-full md:h-20 h-[4.5em] my-2"
                >
                    <div
                        class="flex w-full h-full border-b-4 border-2 rounded-lg shadow-md bg-white dark:bg-slate-700 p-2 border-slate-200 dark:border-slate-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" fill="currentColor"
                            class="h-full items-center justify-center text-slate-400 w-8 mx-3"
                        >
                            <path xmlns="http://www.w3.org/2000/svg" d="M320 128a96 96 0 1 0 -192 0 96 96 0 1 0 192 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM32 480H416c-1.2-79.7-66.2-144-146.3-144H178.3c-80 0-145 64.3-146.3 144zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                        </svg>
                        <div class="flex items-center w-full overflow-hidden">
                            <title-text class="w-fit text-center"> {{ user.pseudo }} </title-text>
                        </div>
                        <div class="flex w-fit h-full items-center justify-end text-slate-400 space-x-2">
                            <button class="flex h-10 w-10 p-1.5 rounded-md justify-center hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-red-500 transition-all">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="h-full items-center justify-center"
                                >
                                    <path xmlns="http://www.w3.org/2000/svg" d="M402.7 425.3l-316-316C52.6 148.6 32 199.9 32 256c0 123.7 100.3 224 224 224c56.1 0 107.4-20.6 146.7-54.7zm22.6-22.6C459.4 363.4 480 312.1 480 256C480 132.3 379.7 32 256 32c-56.1 0-107.4 20.6-146.7 54.7l316 316zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center p-2">
                <button-block v-show="pagination.hasNext">
                    <get-text :context="Lang.CreateTranslationContext('room', 'LoadMore')" /> 
                </button-block>
            </div>
        </div>
    </div>
</template>

<script>
import TitleText from '../../components/text/TitleText.vue';
import ButtonBlock from '../../components/inputs/ButtonBlock.vue';
import ButtonText from '../../components/inputs/ButtonText.vue';
import User from '../../scripts/User';
import GetText from '../../components/text/GetText.vue';
import Lang from '../../scripts/Lang';
import InputText from '../../components/inputs/InputText.vue';
import API from '../../scripts/API';
import * as Ressources from '../../scripts/Ressources';

export default {
    name: "RoomView",
    components: {
        TitleText,
        ButtonBlock,
        ButtonText,
        GetText,
        InputText
    },
    data() {
        return {
            people: [],
            User,
            Lang,
            name: "- - - -",
            editingName: false,
            pagination: API.createPagination(0, 6)
        };
    },
    watch: {
        editingName(newValue, oldValue) {
            if (oldValue === newValue || this.oldname === this.name) return;
            if (newValue) this.oldName = this.name;
            else this.editRoomName(this.name, this.oldname);
        }
    },
    mounted() {
        if (!User.CurrentUser) return;

        this.fetchRoomInformations();
        this.fetchRoomUsers();
    },
    methods: {
        async fetchRoomInformations() {
            const room = await Ressources.getRoom();
            if (!room) return; // TODO : display error
            this.name = room.name;
        },
        async fetchRoomUsers() {
            try {
                const users = await API.execute_logged(API.ROUTE.ROOMUSERS(User.CurrentUser.roomId) + this.pagination);
                users.data.items.forEach((user) => {
                    if (!this.people.find((u) => u.id === user.id))
                        this.people.push(user);
                });
            } catch (err) {
                console.error(err);
            }
        },
        async editRoomName(name, oldname) {
            try {
                const res = await API.execute_logged(API.ROUTE.ROOMS(User.CurrentUser.roomId), API.METHOD.PATCH, { name });
                this.name = res.data.name;
            } catch (err) {
                console.error(err);
            }
        },
        disconnect() {
            User.forget();
            this.$router.go();
        }
    }
}
</script>
