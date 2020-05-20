var Hawk = {};
Hawk.Component = function(classname, options, id) {
    var that = this;
    this.classname = classname;
    this.values = options.values || {};
    this.properties = options.properties || {};
    this.methods = options.methods || {};
    this.bindingsDeclarations = options.bindingsDeclarations || [];
    this.bindings = {};
    this.id = id || -1;
    this.onRefresh = options.onRefresh || function() {};
    this.onClick = options.onClick || function(component) {};
    this.container;
    this.getID = function() {
        return this.id;
    }
    this.getClassname = function() {
        return this.classname;
    }
    this.set = function(key, value) {
        this.values[key] = value;
        return this;
    }
    this.get = function(key) {
        return this.values[key];
    }
    this.update = function(key, value) {
        this.set(key, value);
        this.refreshView();
        this.onRefresh(key, value, this);
        this.updateBinded(key, value);
        return this;
    }
    this.updateBinded = function(key, value) {
        if (typeof this.bindings[key] != 'undfined') {
            this.bindings[key].val(value);
        }
    }
    this.getProperty = function(key) {
        var property = this.properties[key];
        return property(this);
    }
    this.getElement = function(name) {
        return this.container.find('.' + this.getClassname() + '__' + name);
    }
    this.refreshView = function() {
        var element;
        for (var i in this.values) {
            element = this.getElement(i);
            element.html(this.values[i]);
        }
        for (var i in this.properties) {
            element = this.getElement(i);
            element.html(this.getProperty(i));
        }
        for (var i in this.methods) {
            this.methods[i](this);
        }
    }
    this.run = function() {
        var allComponentBindings = {};
        if (this.id > 0) {
            this.container = $('.' + this.getClassname() + '[data-component-id="' + this.getID() + '"]');
            allComponentBindings = $('[data-component-bind="' + this.getClassname() + '.' + this.getID() + '"]');
        } else {
            this.container = $('.' + this.getClassname());
            allComponentBindings = $('[data-component-bind="' + this.getClassname() + '"]');
        }
        for (var i in this.bindingsDeclarations) {
            this.bindings[this.bindingsDeclarations[i]] = allComponentBindings.filter('[data-element-bind="' + this.bindingsDeclarations[i] + '"]');
            $(this.bindings[this.bindingsDeclarations[i]]).keydown(function() {
                var thisthat = $(this);
                setTimeout(function() {
                    that.update(that.bindingsDeclarations[i], thisthat.val());
                }, 10);
            });
        }
    }
}
Hawk.ComponentClass = function(classname, options, template) {
    this.classname = classname;
    this.template = template;
    this.options = options;
    this.instances = {};
    this.newInstance = function(id, values) {
        var resultOptions = options.values = values;
        var instance = new Hawk.Component(this.getClassname(), options, id);
        instance.run();
        return instance;
    }
    this.getClassname = function() {
        return this.classname;
    }
}
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
            progress.css({
                width: (parseFloat(component.getProperty('percentageVictories')) * 100) + "%"
            });
        }
    },
    onRefresh: function(key, value, component) {
        if (key == 'victories') {
            console.log('victory', value);
        }
    }
});
var MyCounter01 = Counter.newInstance(1, {
    victories: 0,
    defeats: 0
});
var MyCounter02 = Counter.newInstance(2, {
    victories: 0,
    defeats: 0
});
$('.counter-button-victory-01').click(function() {
    var currentValue = parseInt(MyCounter01.get('victories'));
    currentValue++;
    MyCounter01.update('victories', currentValue);
});
$('.counter-button-defeat-01').click(function() {
    var currentValue = parseInt(MyCounter01.get('defeats'));
    currentValue++;
    MyCounter01.update('defeats', currentValue);
});
$('.counter-button-victory-02').click(function() {
    var currentValue = parseInt(MyCounter02.get('victories'));
    currentValue++;
    MyCounter02.update('victories', currentValue);
});
$('.counter-button-defeat-02').click(function() {
    var currentValue = parseInt(MyCounter02.get('defeats'));
    currentValue++;
    MyCounter02.update('defeats', currentValue);
});
var Mapper = new Hawk.Component('mapper-item', {
    values: {
        name: ''
    },
    bindingsDeclarations: ['name']
});
Mapper.run();
setTimeout(function() {
    Mapper.update('name', 'lala');
}, 5000);
