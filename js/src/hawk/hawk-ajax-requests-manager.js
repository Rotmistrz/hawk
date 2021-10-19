
Hawk.AjaxRequestType = {
    GET: 'GET',
    POST: 'POST',
};

Hawk.AjaxRequestsManager = function(options) {
    const that = this;

    this.ajaxRequest;
    //this.ajaxRequestWorking = false;

    this.defaultOptions = {
        onSuccess: function() {},
        onError: function() {},
        onFailure: function() {},
        onComplete: function() {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.post = function(path, bundle, callbacks) {
        this.sendRequest(path, Hawk.AjaxRequestType.POST, bundle, callbacks);
    }

    this.get = function(path, callbacks) {
        this.sendRequest(path, Hawk.AjaxRequestType.GET, {}, callbacks);
    }

    this.sendRequest = function(path, type, bundle, callbacks) {
        // if (this.ajaxRequestWorking) {
        //     return false;
        // }

        this.ajaxRequestWorking = true;

        const onSuccess = callbacks.onSuccess || this.options.onSuccess;
        const onFailure = callbacks.onFailure || this.options.onFailure;
        const onError = callbacks.onError || this.options.onError;
        const onComplete = callbacks.onComplete || this.options.onComplete;

        this.ajaxRequest = $.ajax({
            type: type,
            url: path,
            dataType: "json",
            data: bundle,
            success: function(result) {
                console.log(result);

                if (typeof result.success != 'undefined' && result.success) {
                    console.log("SUCCESS");
                    onSuccess(result);
                } else {
                    console.log("FAILURE");
                    onFailure(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                onError();
            },
            complete: function() {
                that.ajaxRequestWorking = false;

                onComplete();
            }
        });

        return this;
    }

    this.run = function() {
        
    }
}