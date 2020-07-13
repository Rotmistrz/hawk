Hawk.ComponentsManager = function(classComponent, wrapperClass) {
    const that = this;

    this.classComponent = classComponent;
    this.wrapperClass = wrapperClass;

    this.getClassComponent = function() {
        return this.classComponent;
    }

    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }

    this.requestsManager = new Hawk.AjaxRequestsManager();

    this.loadComponents = function(path, callback, generalCallback) {
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.getWrapper().html(result.html);

                console.log(result.bundle);

                let current;

                for (let i in result.bundle) {
                    current = that.classComponent.createFromJSON(result.bundle[i]);

                    if (typeof callback == 'function') {
                        callback(current);
                    }
                }

                if (typeof generalCallback == 'function') {
                    generalCallback(result);
                }
            },
            onFailure: function(result) {
                console.log(result);
                
                console.error("A problem during loading components...");
            },
            onError: function(result) {
                console.error("An ERROR during loading components...");
            }
        });
    }

    this.addComponent = function(html, json, callback) {
        const content = $(html);

        this.getWrapper().append(html);

        current = that.classComponent.createFromJSON(json);

        if (typeof callback == 'function') {
            callback(current);
        }
    }
}