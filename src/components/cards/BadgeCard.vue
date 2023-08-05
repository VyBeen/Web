<template>
    <div
        class="flex flex-col justify-center items-center border-2 rounded-md text-slate-700 dark:text-slate-200 transition-all"
        :class="additionnalClasses"
    >
        <slot />
    </div>
</template>

<script>
export default {
    name: "BadgeCard",
    props: {
        hoverable: {
            type: Boolean,
            default: true
        },
        dashed: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        additionnalClasses() {
            return '' +
            (this.hoverable?  (this.selected? ' hover:border-slate-500 hover:dark:border-slate-300' : ' hover:border-slate-300 hover:dark:border-slate-500') + ' hover:text-slate-600 hover:dark:text-white' : '') +
            (this.dashed?    ' border-dashed' : '') +
            (this.selected?  ' border-slate-400 dark:border-slate-400' : ' border-slate-200 dark:border-slate-600 ')
        }
    }
}
</script>