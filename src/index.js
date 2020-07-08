// require ./hawk/_hawk.js


const AppComponents = {};


AppComponents.ModulesGroup = new Hawk.ComponentClass('modules-group', {
        name: ""
    },
    {},
    function(json) {
        let result = [];

        return {
            id: json.id,
            name: json.name
        };
    }
);

AppComponents.Module = new Hawk.ComponentClass('module', {
        name: "",
        elements: []
    },
    {
        methods: {
            refreshElements: function(component) {
                const elements = component.get('elements');

                for (let i in elements) {
                    elements[i].refreshView();
                }
            }
        }
    },
    function(json) {
        const elements = json.elements;

        let result = [];

        for (let i in elements) {
            const element = AppComponents.Element.createFromJSON(elements[i]);

            result[element.getID()] = element;
        }

        return {
            id: json.id,
            name: json.name,
            elements: result
        };
    }
);

AppComponents.Element = new Hawk.ComponentClass('element', {
        name: "",
        code: ""
    },
    {},
    function(json) {
        return {
            id: json.id,
            name: json.name,
            code: json.code
        };
    }
);

const AppComponentManagers = {};

AppComponentManagers.ModulesGroup = new Hawk.ComponentsManager(AppComponents.ModulesGroup, 'modules-group-components');
AppComponentManagers.Module = new Hawk.ComponentsManager(AppComponents.Module, 'module-components');

//const AppContentsManager = new Hawk.ContentsManager('site-content');

//const AppAjaxRequestsController = new Hawk.AjaxRequestsController();

//const AppPagesManager = new Hawk.PagesManager(Routes, 'site-content');

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