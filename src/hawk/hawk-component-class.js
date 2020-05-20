
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