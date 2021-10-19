// require ./hawk/_hawk.js

var Languages = {
    PL: {
        id: 1,
        code: "pl"
    },
    EN: {
        id: 2,
        code: "en"
    },
    DE: {
        id: 3,
        code: "de"
    },
    FR: {
        id: 4,
        code: "fr"
    },
    ES: {
        id: 5,
        code: "es"
    },
    HU: {
        id: 6,
        code: "hu"
    }
};

var ActiveLanguages = [
    Languages.PL,
    Languages.EN,
    Languages.HU
];

var MainLanguage = ActiveLanguages[0];

var FileTypes = {
    UNDEFINED: {
        id: 0,
        type: 'UNDEFINED',
        mimeType: "undefined"
    },

    IMAGE_JPEG: {
        id: 1,
        type: 'IMAGE_JPEG',
        mimeType: "image/jpeg"
    },
    IMAGE_PNG: {
        id: 2,
        type: 'IMAGE_PNG',
        mimeType: "image/png"
    },
    IMAGE_SVG: {
        id: 3,
        type: 'IMAGE_SVG',
        mimeType: "image/svg+xml"
    },

    AUDIO_MP3: {
        id: 30,
        type: 'AUDIO_MP3',
        mimeType: "audio/mpeg"
    },

    FILE_PDF: {
        id: 40,
        type: 'FILE_PDF',
        mimeType: "application/pdf"
    },
    FILE_DOC: {
        id: 41,
        type: 'FILE_DOC',
        mimeType: "application/msword"
    },
    FILE_XLS: {
        id: 42,
        type: 'FILE_XLS',
        mimeType: "application/vnd.ms-excel"
    },
    FILE_DOCX: {
        id: 43,
        type: 'FILE_DOCX',
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    FILE_XLSX: {
        id: 44,
        type: 'FILE_XLSX',
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },

    getByID: function(id) {
        for (var i in FileTypes) {
            if (FileTypes[i].hasOwnProperty('id') && FileTypes[i].id == id) {
                return FileTypes[i];
            }
        }

        return FileTypes.UNDEFINED;
    }
};

const ElementTypes = {
    UNDEFINED: 0,

    PLAIN_TEXT: 1,
    TEXT: 2,
    EXTENDED_TEXT: 3,
    SHORT_TEXT: 4,
    DATE: 8,

    ATTACHMENT: 10,

    CATEGORY: 20
}

const AppConstants = {};

AppConstants.EntityType = {
    COMPONENT: 1,
    CATEGORY: 2
};

const AppComponents = {};

AppComponents.ModulesGroup = new Hawk.ComponentClass('modules-group', {
        name: "",
        distinguished: false
    },
    {},
    {
        methods: {
            refreshDistinguished: function(component) {
                if (component.get('distinguished')) {
                    component.getContainer().addClass('modules-group--distinguished')
                } else {
                    component.getContainer().removeClass('modules-group--distinguished')
                }
            }
        }
    },
    function(json) {
        let result = [];

        return {
            id: json.id,
            values: {
                name: json.name,
                distinguished: json.isDistinguished
            },
            subcomponents: {}
        };
    }
);

AppComponents.Element = new Hawk.ComponentClass('element', {
        name: "",
        code: "",
        representative: false
    },
    {},
    {
        methods: {
            refreshRepresentative: function(component) {
                var element = component.getElement('name-container');
                var operationElement = component.getElement('representative-link');

                if (component.get('representative')) {
                    element.addClass('distinguished-element--active');
                    operationElement.css({ visibility: 'hidden' });
                } else {
                    element.removeClass('distinguished-element--active');
                    operationElement.css({ visibility: 'visible' });
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
                representative: json.isRepresentative
            },
            subcomponents: {}
        };
    }
);

AppComponents.Attachment = new Hawk.ComponentClass('attachment', {
        name: "",
        code: "",
        representative: false
    },
    {},
    {
        methods: {
            refreshRepresentative: function(component) {
                var element = component.getElement('name-container');
                var operationElement = component.getElement('representative-link');

                if (component.get('representative')) {
                    element.addClass('distinguished-element--active');
                    operationElement.css({ visibility: 'hidden' });
                } else {
                    element.removeClass('distinguished-element--active');
                    operationElement.css({ visibility: 'visible' });
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
                representative: json.isRepresentative
            },
            subcomponents: {}
        };
    }
);

AppComponents.Category = new Hawk.ComponentClass('category', {
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

AppComponents.Component = new Hawk.ComponentClass('component', {
        representativeName: "",
        visible: true,
        contents: []
    },
    {
        subcomponents: {}
    },
    {
        methods: {
            checkVisibility: function(component) {
                var enabledIcon = component.getElement('hideComponent');
                var disabledIcon = component.getElement('showComponent');

                if (component.get('visible')) {
                    enabledIcon.show();
                    disabledIcon.hide();

                    component.getContainer().removeClass('component--hidden')
                } else {
                    enabledIcon.hide();
                    disabledIcon.show();

                    component.getContainer().addClass('component--hidden')
                }
            }
        }
    },
    function(json) {
        // submodules
        const subcomponentsData = json.subcomponents;

        let subcomponents = [];

        for (let i in subcomponentsData) {
            subcomponents["subcomponents_" + i] = [];

            for (let j in subcomponentsData[i]) {
                const subcomponent = AppComponents.Component.createFromJSON(subcomponentsData[i][j]);

                const contents = subcomponent.get('contents');
                const representativeName = subcomponent.get('representativeName');

                subcomponent.set('contents', contents[MainLanguage.id]);
                subcomponent.set('representativeName', representativeName[MainLanguage.id]);

                (subcomponents["subcomponents_" + i]).push(subcomponent);
            }
        }

        console.log(json.id, json.representativeName);
        console.log(json.contents);
        console.log(json.subcomponents);

        return {
            id: json.id,
            values: {
                representativeName: json.representativeName,
                visible: json.isVisible,
                contents: json.contents
            },
            subcomponents: subcomponents
        };
    }
);


AppComponents.Module = new Hawk.ComponentClass('module', {
        name: "",
        type: AppConstants.EntityType.COMPONENT
    },
    {
        elements: {},
        attachments: {},
        categories: {},
        components: {},
        submodules: {}
    },
    {
        methods: {
            refreshType: function(component) {
                const type = component.get('type');

                const typeIcon = component.getElement('icon');
                const categoriesRow = component.getElement('categories-row');

                if (type == AppConstants.EntityType.CATEGORY) {
                    typeIcon.attr('src', "/herocms/img/icons/subsection/icon-category-small-primary.svg");

                    categoriesRow.velocity("slideUp", {
                        duration: 200
                    });
                } else {
                    typeIcon.attr('src', "/herocms/img/icons/subsection/icon-module-small-primary.svg");

                    categoriesRow.velocity("slideDown", {
                        duration: 400
                    });
                }
            }
        }
    },
    function(json) {
        // elements
        const elementsData = json.elements;

        let elements = [];

        for (let i in elementsData) {
            const element = AppComponents.Element.createFromJSON(elementsData[i]);

            elements[element.getID()] = element;
        }

        // attachments
        const attachmentsData = json.attachments;

        let attachments = [];

        for (let i in attachmentsData) {
            const attachment = AppComponents.Attachment.createFromJSON(attachmentsData[i]);

            attachments[attachment.getID()] = attachment;
        }

        // categories
        const categoriesData = json.categories;

        let categories = [];

        for (let i in categoriesData) {
            const category = AppComponents.Category.createFromJSON(categoriesData[i]);

            categories[category.getID()] = category;
        }

        // components
        const componentsData = json.components;

        let components = [];

        for (let i in componentsData) {
            const component = AppComponents.Component.createFromJSON(componentsData[i]);

            components[component.getID()] = component;
        }

        // submodules
        const submodulesData = json.submodules;

        let submodules = [];

        for (let i in submodulesData) {
            const submodule = AppComponents.Module.createFromJSON(submodulesData[i]);

            submodules[submodule.getID()] = submodule;
        }

        return {
            id: json.id,
            values: {
                name: json.name,
                type: json.type
            },
            subcomponents: {
                elements: elements,
                attachments: attachments,
                categories: categories,
                components: components,
                submodules: submodules
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

                let currentValue;

                //console.log(values);

                for (let language in ActiveLanguages) {
                    current = ActiveLanguages[language];

                    element = component.getElement('value-' + current.code);

                    //console.log('value-' + current.code);

                    currentValue = values[current.id];

                    if (typeof currentValue != 'undefined') {
                        element.html(currentValue.substring(0, 50));
                    }
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
AppComponentManagers.Component = new Hawk.ComponentsManager(AppComponents.Component, 'component-components');

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