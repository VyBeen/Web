<template>
    <div class="flex flex-col grow justify-evenly items-center space-y-8">
        <icon-card />
        <div class="flex flex-col justify-center space-y-8 items-center">
            <badge-card class="m-4 p-4 space-y-4">
                <title-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('notfound', 'Title')" /> </title-text>
                <base-text class="text-center"> <get-text :context="Lang.CreateTranslationContext('notfound', 'Desc')" /> </base-text>
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
            Lang
        };
    },
    mounted() {

    },
    methods: {
        goHome() {
            this.$router.push({ name: 'Home' });
        }
    }
}
</script>