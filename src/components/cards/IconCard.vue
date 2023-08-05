<template>
    <h1 class="md:text-6xl text-4xl font-extrabold text-green-500 drop-shadow-lg"> {{ text }} </h1>
</template>

<script>
export default {
    name: "IconCard",
    props: {
        clickable: {
            type: Boolean,
            default: false
        },
        animate: {
            type: Boolean,
            default: true
        },
        text: {
            type: String,
            default: "VyBeen"
        },
    },
    data() {
        return {};
    }
}
</script>
