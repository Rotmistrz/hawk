
Hawk.ComponentClass = function(classname, options, parseJSON) {
    const that = this;

    this.classname = classname;

    this.options = options;

    this.parseJSON = parseJSON || function(json) {};

    this.instances = [];

    this.newInstance = function(id) {
        if (!this.instanceExists(id)) {
            const instance = new Hawk.Component(this.getClassname(), options, id);
            instance.run();

            this.instances[instance.getID()] = instance;

            return instance;
        } else {
            return null;
        }
    }

    this.instanceExists = function(index) {
        return typeof this.instances[index] != 'undefined';
    }

    this.getInstance = function(index) {
        if (this.instanceExists(index)) {
            return this.instances[index];
        } else {
            return null;
        }
    }

    this.createFromJSON = function(json) {
        const id = this.parseJSON(json);

        return this.newInstance(id);
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