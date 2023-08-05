<template>
    <div class="flex h-fit w-full justify-between md:space-x-8 space-x-4 items-center my-2 min-w-0 max-w-full">
        <label class="flex text-xl text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap text-ellipsis w-fit">
            <get-text :context="label" />
        </label>
        <div class="min-w-0 max-w-full">
            <select
                id=""
                ref="select"
                :name="name"
                :value="value"
                :disabled="disabled"
                class="flex h-fit border-2 rounded-md px-2 py-1 border-slate-200 dark:border-slate-600 font-bold text-md whitespace-nowrap max-w-full
                       min-w-0 text-ellipsis transition-colors outline-2 outline-offset-2 outline-green-500 focus:outline placeholder-slate-600/[0.5]"
                :class="disabled ? ' bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-400 ' : ' bg-white dark:bg-slate-600 text-slate-400 dark:text-slate-200 hover:border-slate-300 hover:dark:border-slate-500 '"
                @change="onchange"
            >
                <option
                    v-for="el in elements"
                    :key="el.value"
                    :value="el.value"
                >
                    <p v-if="el.name"> {{ el.name }} </p>
                    <get-text v-else :context="Lang.CreateTranslationContext(el.file, el.code)" />
                </option>
            </select>
        </div>
        <input
            ref="input"
            :name="name"
            type="number"
            class="hidden"
        >
    </div>
</template>

<script>
import Lang from '../../scripts/Lang';
import GetText from '../text/GetText.vue';

function setup(obj) {
    obj.selected = obj.value;
    obj.inputEl = null;
    obj.selectEl = null;

    obj.elements = [];
    for (let i = 0; i < obj.list.length; i++) {
        const el = obj.list[i];
        obj.elements.push({
            name: el.name,
            code: el.code,
            file: el.file,
            value: el.value,
            selected: el.value === obj.value || el.selected
        });
    }
}

export default {
    name: 'InputChoice',
    components: { GetText },
    props: {
        label: {
            type: String,
            default: "",
            required: false
        },
        value: {
            type: [Number, String],
            default: 0,
            required: false
        },
        list: {
            type: Array,
            default: () => [],
            required: true
        },
        onchange: {
            type: Function,
            default: null,
            required: false
        },
        name: {
            type: String,
            default: "",
            required: false
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        setup(this);
        return {
            Lang
        };
    },
    mounted() {
        this.selected = this.value;
        this.elements.forEach(item => {
            if (item.selected) {
                this.selected = item.value;
            }
        });
    },
    methods: {
        
    }
}
</script>