// require ./hawk/_hawk.js


var Languages = {
    PL: {
        id: 1,
        code: "PL"
    },
    EN: {
        id: 2,
        code: "EN"
    },
    DE: {
        id: 3,
        code: "DE"
    },
    FR: {
        id: 4,
        code: "FR"
    },
    ES: {
        id: 5,
        code: "ES"
    }
};

var ActiveLanguages = [
    Languages.PL,
    Languages.EN
];

const AppComponents = {};


AppComponents.ModulesGroup = new Hawk.ComponentClass('modules-group', {
        name: ""
    },
    {},
    {},
    function(json) {
        let result = [];

        return {
            id: json.id,
            values: {
                name: json.name
            },
            subcomponents: {}
        };
    }
);

AppComponents.Element = new Hawk.ComponentClass('element', {
        name: "",
        code: ""
    },
    {},
    {},
    function(json) {
        return {
            id: json.id,
            values: {
                name: json.name,
                code: json.code
            },
            subcomponents: {}
        };
    }
);

AppComponents.Attachment = new Hawk.ComponentClass('attachment', {
        name: "",
        code: ""
    },
    {},
    {},
    function(json) {
        return {
            id: json.id,
            values: {
                name: json.name,
                code: json.code
            },
            subcomponents: {}
        };
    }
);

AppComponents.Module = new Hawk.ComponentClass('module', {
        name: ""
    },
    {
        elements: {},
        attachments: {}
    },
    {},
    function(json) {
        const elementsData = json.elements;

        let elements = [];

        for (let i in elementsData) {
            const element = AppComponents.Element.createFromJSON(elementsData[i]);

            elements[element.getID()] = element;
        }

        const attachmentsData = json.attachments;

        let attachments = [];

        for (let i in attachmentsData) {
            const attachment = AppComponents.Attachment.createFromJSON(attachmentsData[i]);

            attachments[attachment.getID()] = attachment;
        }

        return {
            id: json.id,
            values: {
                name: json.name
            },
            subcomponents: {
                elements: elements,
                attachments: attachments
            }
        };
    }
);

AppComponents.DefinedData = new Hawk.ComponentClass('defined-data', {
        name: "",
        code: "",
        values: []
    },
    {

    },
    {
        methods: {
            placeLanguagesSubsets: function(component) {
                let element;
                const values = component.get('values');
                let current;

                console.log(values);

                for (let language in ActiveLanguages) {
                    current = ActiveLanguages[language];

                    element = component.getElement('value-' + current.code);

                    console.log('value-' + current.code);

                    element.html(values[current.id]);
                }
            }
        }
    },
    function(json) {
        return {
            id: json.id,
            values: {
                name: json.name,
                code: json.code,
                values: json.values
            },
            subcomponents: {}
        };
    }
);

const AppComponentManagers = {};

AppComponentManagers.ModulesGroup = new Hawk.ComponentsManager(AppComponents.ModulesGroup, 'modules-group-components');
AppComponentManagers.Module = new Hawk.ComponentsManager(AppComponents.Module, 'module-components');
AppComponentManagers.DefinedData = new Hawk.ComponentsManager(AppComponents.DefinedData, 'defined-data-components');

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