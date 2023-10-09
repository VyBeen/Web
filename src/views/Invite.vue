<template>
    <div class="flex flex-col grow justify-evenly items-center space-y-8">
        <icon-card />
        <div class="flex flex-col justify-center space-y-8 items-center">
            <badge-card class="m-4 p-4 space-y-4">
                <title-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('invite', 'Title', {room})" /> </title-text>
                <base-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('invite', 'Desc')" /> </base-text>
            </badge-card>
            <button-block :onclick="goHome">
                <get-text :context="Lang.CreateTranslationContext('notfound', 'Back')" />
            </button-block>
        </div>
    </div>
</template>*

<script>
import BadgeCard from '../components/cards/BadgeCard.vue';
import Lang from '../scripts/Lang';
import GetText from '../components/text/GetText.vue';
import TitleText from '../components/text/TitleText.vue';
import BaseText from '../components/text/BaseText.vue';
import ButtonBlock from '../components/inputs/ButtonBlock.vue';
import IconCard from '../components/cards/IconCard.vue';
import API from '../scripts/API';
import User from '../scripts/User';

export default {
    name: "NotFound",
    components: {
        BadgeCard,
        GetText,
        TitleText,
        BaseText,
        ButtonBlock,
        IconCard
    },
    data() {
        return {
            Lang,
            room: "- - - -"
        };
    },
    mounted() {
        if (User.CurrentUser === null) {
            this.$router.push({ name: 'Login', query: { link: this.$route.fullPath } });
            return;
        }

        const roomId = this.$route.params.room;
        if (roomId === undefined || roomId === null) {
            this.goHome();
            return;
        }

        API.execute_logged(API.ROUTE.ROOMS(roomId)).then(res => {
            this.room = res.data.name;
            this.joinRoom(roomId);
        }).catch(err => {
            console.error(err);
            this.goHome();
        })
    },
    methods: {
        goHome() {
            this.$router.push({ name: 'Home' });
        },
        joinRoom(id) {
            API.execute_logged(API.ROUTE.ROOMS(id), API.METHOD.POST, {roomId: id}).then(res => {
                API.execute_logged(API.ROUTE.USERS(User.CurrentUser.id)).then(res => {
                    User.CurrentUser.setInformations(res.data);
                    User.CurrentUser.save();
                    this.goHome();
                }).catch(err => { console.error(err); this.goHome(); });
            }).catch(err => { console.error(err); this.goHome(); });
        }
    }
}
</script>