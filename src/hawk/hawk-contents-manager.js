Hawk.ContentsManager = function(wrapperClass) {
    const that = this;

    this.wrapperClass = wrapperClass;
    this.requestsManager = new Hawk.AjaxRequestsManager();

    this.getWrapper = function() {
        return $('.' + this.wrapperClass);
    }

    this.changeContent = function(content) {
        that.getWrapper().html(content);
    }

    this.load = function(path, callback) {
        this.requestsManager.get(path, {
            onSuccess: function(result) {
                that.changeContent(result.html);

                if (typeof callback == 'function') {
                    callback();
                }
            },
            onFailure: function(result) {
                console.error("A problem during loading contents...");
            },
            onError: function(result) {
                console.error("An ERROR during loading contents...");
            }
        });
    }
}