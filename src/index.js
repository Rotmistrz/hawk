// require ./hawk/_hawk.js

var Counter = new Hawk.Component('counter', {
    values: {
        victories: 0,
        defeats: 0
    },
    properties: {
        percentageVictories: function(component) {
            return component.get('victories') / (component.get('victories') + component.get('defeats'));
        }
    },
    methods: {
        calculateProgress: function(component) {
            var progress = component.getElement('progress');

            progress.css({ width: (parseFloat(component.getProperty('percentageVictories')) * 100) + "%" });
        }
    },
    onRefresh: function(key, value, component) {
        if (key == 'victories') {
            console.log('victory', value);
        }
    }
});
Counter.run();

$('.counter-button-victory').click(function() {
    var currentValue = parseInt(Counter.get('victories'));

    currentValue++;

    Counter.update('victories', currentValue);
});

$('.counter-button-defeat').click(function() {
    var currentValue = parseInt(Counter.get('defeats'));

    currentValue++;

    Counter.update('defeats', currentValue);
});

var Mapper = new Hawk.Component('mapper-item', {
    values: {
        name: ''
    },
    bindingsDeclarations: [
        'name'
    ]
});
Mapper.run();

setTimeout(function() {
    Mapper.update('name', 'lala');
}, 5000);