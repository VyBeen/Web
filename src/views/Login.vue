<template>
    <div class="flex flex-col grow justify-evenly items-center space-y-8">
        <icon-card />
        <div
            v-if="User.CurrentUser"
            class="flex flex-col justify-center space-y-8 items-center"
        >
            <badge-card class="m-4 p-4 space-y-4">
                <title-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'LoggedIn')" /> </title-text>
                <base-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'Redirect')" /> </base-text>
            </badge-card>
        </div>
        <div
            v-else
            class="flex"
        >
            <div
                v-if="mode === 'login'"
                class="flex flex-col justify-center space-y-8 items-center"
            >
                <badge-card class="m-4 p-4 space-y-4">
                    <title-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'Title')" /> </title-text>
                    <base-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'Desc')" /> </base-text>
                    <button-block
                        :disabled="loginBtnDisabled"
                        color="green"
                        :onclick="login"
                    >
                        <get-text :context="Lang.CreateTranslationContext('login', 'LogIn')" />
                    </button-block>
                </badge-card>
                <button-block :onclick="goBack">
                    <get-text :context="Lang.CreateTranslationContext('login', 'Back')" />
                </button-block>
            </div>
            <div
                v-else
                class="flex flex-col justify-center space-y-8 items-center"
            >
                <badge-card class="m-4 p-4 space-y-4">
                    <title-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'PleaseWait')" /> </title-text>
                    <base-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('login', 'RetreivingUser')" /> </base-text>
                </badge-card>
                <button-block :onclick="goBack">
                    <get-text :context="Lang.CreateTranslationContext('login', 'Back')" />
                </button-block>
            </div>
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
import User from '../scripts/User';
import API from '../scripts/API';

import 'https://cdn.furwaz.com/api/portal.min.js';

export default {
    name: "LoginVue",
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
            User,
            mode: 'login',
            loginBtnDisabled: false
        };
    },
    mounted() {
        if (User.CurrentUser !== null) {
            setTimeout(() => {
                this.goToLink();
            }, 1000);
            return;
        }

        const token = this.$route.query.token;
        if (token) {
            this.mode = 'register';
            this.register(token);
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        async login() {
            this.loginBtnDisabled = true;
            const response = await API.execute(API.ROUTE.TOKEN());
            const token = response.data;

            const portal = new FurWaz.Portal(token, { mode: 'href' });
            portal.on('close', () => { this.register(token); });
            portal.open();
        },
        async register(token) {
            const response = await API.execute(API.ROUTE.REGISTER(token));
            const user = new User(response.data);
            user.save();
            setTimeout(() => {
                this.goToLink();
            }, 1000);
        },
        goToLink() {
            const queryLink = this.$route.query.link;
            if (queryLink) {
                this.$router.push(queryLink);
            } else {
                this.$router.push({ name: 'Home' });
            }
        }
    }
}
</script>
