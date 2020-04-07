Vue.component('unit-cell', {
    props: [ 'unit', 'bookWeightPersent' ],
    methods: {
        unitEdit: unitEdit
    },
    template:   `<div
                    class="unit-cell"
                    v-on:click="unitEdit"
                    v-bind:unit-guid="unit.unitGuid"
                    v-bind:style="{
                        left: (unit.bookPixFrom / bookWeightPersent) + '%',
                        width: ((unit.bookPixTo - unit.bookPixFrom) / bookWeightPersent) + '%'
                    }"
                >
                {{ unit.number }}
                ({{ unit.bookFrom.getUTCDate() }}.
                {{ unit.bookFrom.getUTCMonth()+1 }}.
                {{ unit.bookFrom.getUTCFullYear() }} - 
                {{ unit.bookTo.getUTCDate() }}.
                {{ unit.bookTo.getUTCMonth()+1 }}.
                {{ unit.bookTo.getUTCFullYear() }})
                </div>`
});

Vue.component('level-row', {
    props: [ 'level', 'bookWeightPersent' ],
    template: `<div class="level-row"
                ><unit-cell
                    v-for="unit in level"
                    :unit="unit"
                    :bookWeightPersent="bookWeightPersent"
                /></div>`
});

Vue.component('levels-list', {
    props: [ 'levels', 'bookWeightPersent' ],
    template: `<div
                    class="levels-list"
                ><level-row
                    v-for="level in levels"
                    :level="level"
                    :bookWeightPersent="bookWeightPersent"
                /></div>`
});

function sortUnitsForRendering(units) {
    if (units.length == 0) {
        return {};
    }

    const levels = {};

    app.minDate = new Date(units[0].bookFrom);
    app.maxDate = new Date(units[0].bookTo);

    units.forEach(unit => {
        if (levels[unit.number] == undefined) {
            levels[unit.number] = [];
        }

        unit.bookFrom = new Date(unit.bookFrom);
        unit.bookTo = new Date(unit.bookTo);

        if (unit.bookFrom < app.minDate) {
            app.minDate = unit.bookFrom;
        }
        if (unit.bookTo > app.maxDate) {
            app.maxDate = unit.bookTo;
        }

        levels[unit.number].push(unit);
    });

    units.forEach(unit => {
        unit.bookPixFrom = unit.bookFrom - app.minDate;
        unit.bookPixTo = unit.bookTo - app.minDate;
    });

    // filling empty unit places for rendering
    for (let i = 1; i < Math.max.apply(null, Object.keys(levels)); i++) {
        if (levels[i] == undefined) {
            levels[i] = [];
        }
    }

    app.bookWeightPersent = (app.maxDate.getTime() - app.minDate.getTime()) / 100;

    console.log(app.minDate, app.maxDate);

    return levels;
}

const app = new Vue({
    el: '#app',
    template: `<levels-list
                    :levels="levels"
                    :bookWeightPersent="bookWeightPersent"
                />`,
    data: {
        units: [],
        levels: {},
        statuses: [],
        bookWeightPersent: 1,
        tv: "100px",
        minDate: 0,
        maxDate: 0
    },
    computed: {
        test: function() {
            return this.tv;
        }
    },
    mounted() {
        fetch(`http://${constants.HOST}:${constants.PORT}/${constants.CONTEXT_PATH}/info/getall`)
        .then(response => response.json())
        .then(response => {
            this.units = response;
            return response;
        })
        .then(response => this.levels = sortUnitsForRendering(response));
    }
});
