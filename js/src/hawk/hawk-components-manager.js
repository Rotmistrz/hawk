Hawk.ComponentsManager = function(classComponent, wrapperClass, options) {
    const that = this;

    this.classComponent = classComponent;
    this.wrapperClass = wrapperClass;

    this.defaultOptions = {
        contentContainerClass: 'components',
        loaderClass: 'contents-manager__loader'
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.getClassComponent = function() {
        return this.classComponent;
    }

    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }

    this.getContentContainer = function() {
        return this.getWrapper().find('.' + this.options.contentContainerClass);
    }

    this.getLoader = function() {
        return this.getWrapper().find('.' + this.options.loaderClass);
    }

    this.requestsManager = new Hawk.AjaxRequestsManager();

    // this.loadComponent = function(path, id, callback) {
    //     this.requestsManager.get(path + "/" + id, {
    //         onSuccess: function(result) {
    //             that.getWrapper().html(result.html);

    //             console.log(result);

    //             let current;

    //             for (let i in result.bundle) {
    //                 current = that.classComponent.createFromJSON(result.bundle[i]);

    //                 if (typeof callback == 'function') {
    //                     callback(current);
    //                 }
    //             }

    //             if (typeof generalCallback == 'function') {
    //                 generalCallback(result);
    //             }
    //         },
    //         onFailure: function(result) {
    //             console.log(result);
                
    //             console.error("A problem during loading components...");
    //         },
    //         onError: function(result) {
    //             console.log(result);

    //             console.error("An ERROR during loading components...");
    //         }
    //     });
    // }

    this.loadComponents = function(path, callback, generalCallback) {
        var loader = this.getLoader();
        loader.show();

        //console.log("loading...........");

        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.getContentContainer().html(result.html);

                //console.log(result);

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
                console.log(result);

                console.error("An ERROR during loading components...");
            },
            onComplete: function() {
                loader.hide();

                //console.log("loading completed");
            }
        });
    }

    this.addComponent = function(html, json, callback) {
        const content = $(html);

        that.getContentContainer().append(html);

        current = that.classComponent.createFromJSON(json);

        if (typeof callback == 'function') {
            callback(current);
        }
    }

    this.swapComponents = function(firstID, secondID) {
        const wrappers = this.getWrapper();

        wrappers.each(function() {
            const firstElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + firstID + '"]');
            const secondElement = $(this).find('.' + that.classComponent.getClassname() + '[data-component-id="' + secondID + '"]');

            var height = firstElement.outerHeight();

            var firstCopy = firstElement.clone();
            var secondCopy = secondElement.clone();

            firstElement.velocity({ top: -height + "px"}, {
                duration: 200
            });

            secondElement.velocity({ top: height + "px" }, {
                duration: 200
            });

            setTimeout(function() {
                firstElement.replaceWith(secondCopy);
                secondElement.replaceWith(firstCopy);
            }, 200);
        });
    }
}