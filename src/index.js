// require ./hawk/_hawk.js


const AppComponents = {};


AppComponents.Team = new Hawk.ComponentClass('team', {
        name: "",
        players: []
    },
    {},
function(json) {
    return {
        id: json.id,
        name: json.name,
        players: json.players
    };
});


AppComponents.Match = new Hawk.ComponentClass('match', {
        date: "",
        'host-name': "",
        'guest-name': "",
        'host-result': 0,
        'guest-result': 0
    }, {
    properties: {
        result: function(component) {
            return component.get('host-result') + ":" + component.get('guest-result');
        }
    }
},
function(json) {
    return {
        id: json.id,
        date: json.date,
        'host-name': json.host.name,
        'guest-name': json.guest.name,
        'host-result': json.hostResult,
        'guest-result': json.guestResult
    };
});

AppComponents.Player = new Hawk.ComponentClass('player', {
        name: "",
        surname: "",
        'position-name': ""
    }, {
    },
    function(json) {
        return {
            id: json.id,
            name: json.name,
            surname: json.surname,
            'position-name': json.positionName
        };
    });

const AppComponentManagers = {};

AppComponentManagers.Team = new Hawk.ComponentsManager(AppComponents.Team, 'team-components');
AppComponentManagers.EnemyTeam = new Hawk.ComponentsManager(AppComponents.Team, 'enemy-team-components');
AppComponentManagers.Match = new Hawk.ComponentsManager(AppComponents.Match, 'match-components');
AppComponentManagers.Player = new Hawk.ComponentsManager(AppComponents.Player, 'player-components');

const AppContentsManager = new Hawk.ContentsManager('site-content');

const AppAjaxRequestsController = new Hawk.AjaxRequestsController();

const AppPagesManager = new Hawk.PagesManager(Routes, 'site-content');

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