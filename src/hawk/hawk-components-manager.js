Hawk.ComponentsManager = function() {
    this.requestsManager = new Hawk.AjaxRequestsManager();

    this.loadComponents = function(path, componentClass, wrapperClass) {
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                $('.' + wrapperClass).html(result.html);

                let current;

                for (let i in result.bundle) {
                    console.log(componentClass.createFromJSON(result.bundle[i]));
                }

            },
            onFailure: function(result) {
                console.error("A problem during loading components...");
            }
        });
    }
}