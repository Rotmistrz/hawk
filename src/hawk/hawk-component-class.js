
Hawk.ComponentClass = function(classname, values, options, parseJSON) {
    const that = this;

    this.classname = classname;

    this.values = values;
    this.options = options;

    this.parseJSON = parseJSON || function(json) {};

    this.instances = [];

    this.getOptions = function() {
        return this.options;
    }

    this.getValues = function() {
        return this.values;
    }

    this.newInstance = function(id, values, force) {
        //if (!this.instanceExists(id)) {
            let certainValues = this.getValues();

            if (typeof values != 'undefined') {
                certainValues = this.parseValues(values);
            }
            
            const instance = new Hawk.Component(this.getClassname(), certainValues, this.getOptions(), id);
            instance.run();
            instance.refreshView();

            this.instances[instance.getID()] = instance;

            return instance;
        // } else {
        //     return null;
        // }
    }

    this.instanceExists = function(index) {
        return typeof this.instances[index] != 'undefined';
    }

    this.parseValues = function(certainValues) {
        const resultValues = {};

        for (let i in this.values) {
            if (typeof certainValues[i] != 'undefined') {
                resultValues[i] = certainValues[i];
            }
        }

        return resultValues;
    }

    this.getInstance = function(index) {
        if (this.instanceExists(index)) {
            return this.instances[index];
        } else {
            return null;
        }
    }

    this.removeInstance = function(index) {
        if (this.instanceExists(index)) {
            const current = this.instances[index];

            current.remove();
        }
    }

    this.refreshView = function() {


        for (let i in this.instances) {
            console.log(this.instances[i]);
            
            this.instances[i].refreshView();
        }
    }

    this.createFromJSON = function(json) {
        const fields = this.parseJSON(json);

        console.log(fields);
        console.log(typeof fields.id != 'undefined');

        if (typeof fields.id != 'undefined') {
            const values = this.parseValues(fields);

            console.log(values);

            return this.newInstance(fields.id, values);
        } else {
            return null;
        }
    }

    this.clearInstances = function() {
        this.instances = [];
    }

    this.getClassname = function() {
        return this.classname;
    }

    this.initialize = function() {
        const components = $('.' + this.getClassname());

        let currentID = -1;

        components.each(function() {
            currentID = $(this).attr(Hawk.Constants.COMPONENT_ID_ATTRIBUTE);

            if (currentID > 0) {
                that.newInstance(currentID);
            }
        });
    }
}