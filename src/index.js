// require ./hawk/_hawk.js



var Counter = new Hawk.ComponentClass('counter', {
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
Counter.initialize();

const Team = new Hawk.ComponentClass('team', {
    values: {
        name: ""
    }
},
function(json) {
    return json['id'];
});

const AppComponentManager = new Hawk.ComponentsManager();
AppComponentManager.loadComponents('/teams/get', Team, 'team-components');



/**var MyCounter01 = Counter.newInstance(1);

var MyCounter02 = Counter.newInstance(2);

console.log(Counter.instanceExists(MyCounter01.getID()));
console.log(Counter.instanceExists(3));**/


// const MyCounter01 = Counter.getInstance(1);

// const MyCounter02 = Counter.getInstance(2);


// $('.counter-button-victory-01').click(function() {
//     var currentValue = parseInt(MyCounter01.get('victories'));

//     currentValue++;

//     MyCounter01.update('victories', currentValue);
// });

// $('.counter-button-defeat-01').click(function() {
//     var currentValue = parseInt(MyCounter01.get('defeats'));

//     currentValue++;

//     MyCounter01.update('defeats', currentValue);
// });


// $('.counter-button-victory-02').click(function() {
//     var currentValue = parseInt(MyCounter02.get('victories'));

//     currentValue++;

//     MyCounter02.update('victories', currentValue);
// });

// $('.counter-button-defeat-02').click(function() {
//     var currentValue = parseInt(MyCounter02.get('defeats'));

//     currentValue++;

//     MyCounter02.update('defeats', currentValue);
// });

// var Mapper = new Hawk.ComponentClass('mapper-item', {
//     values: {
//         name: ''
//     },
//     bindingsDeclarations: [
//         'name'
//     ]
// });
// Mapper.initialize();

// const CurrentMapper = Mapper.getInstance(1);

// setTimeout(function() {
//     CurrentMapper.update('name', 'lala');
// }, 5000);