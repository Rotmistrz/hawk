Hawk.Validator = {};

Hawk.Validator.isEmail = function(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {  
        return true;  
    } else {
        return false;
    }
}

Hawk.Validator.isPhoneNumber = function(number) {
    if (/^\+?[0-9\s]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isNotEmpty = function(value) {
    if (value.length > 0) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.longerThan = function(str, length) {
    if (str.length > length) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isSomethingChecked = function(field) {
    if (field.is(':checked')) {
        return true;
    } else {
        return false;
    }
}

Hawk.isInObject = function(value, obj) {
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }

        if (obj[k] === value) {
            return true;
        }
    }

    return false;
}

Hawk.createBundleFromString = function(str) {
    var parts = str.split('&');

    var result = {};

    var current;
    var data;
    var key;
    var value;

    for (var i in parts) {
        current = parts[i];

        data = current.split('=');

        key = data[0];
        value = data[1];

        result[key] = value;
    }

    return result;
}

Hawk.mergeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = (object.hasOwnProperty(property)) ? object[property] : mainObject[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.mergeWholeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = mainObject[property];
        }
        

        //console.log("object." + property + ": " + result[property]);
    }

    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            result[property] = object[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.scrollToElement = function(options) {
    var defaultOptions = {
        container: window,
        anchor: '#top' + Hawk.anchorSufix,
        callback: function() {},
        delay: 0,
        duration: 800,
        offset: 0
    };

    options = Hawk.mergeObjects(defaultOptions, options);

    setTimeout(function(){
        $(options.container).scrollTo(options.anchor, options.duration, {'axis': 'y', 'offset': options.offset, onAfter: function() { options.callback(); } });
    }, options.delay);

    return this;
}

Hawk.DropdownConstants = {
    modes: {
        PLAIN: 0,
        CHOOSABLE: 1
    },

    types: {
        OVERLAYER: 0,
        EXPANDING: 1
    },

    directions: {
        DOWNWARDS: 0,
        UPWARDS: 1
    }
}

Hawk.Dropdown = function(container, options) {
    var that = this;

    this.container = $(container).first();

    this.header;
    this.title;
    this.list;
    this.listContainer;

    this.fields;

    this.states = {
        CLOSED: 0,
        OPEN: 1
    }

    this.defaultOptions = {
        slideSpeed: 200,

        mode: Hawk.DropdownConstants.modes.PLAIN,
        type: Hawk.DropdownConstants.types.OVERLAYER,
        direction: Hawk.DropdownConstants.directions.DOWNWARDS,

        containerClass: 'dropdown',
        expandingTypeClass: 'dropdown--expanding',
        choosableModeClass: 'dropdown--choosable',
        upwardsDirectionClass: 'dropdown--upwards',
        openClass: 'dropdown--open',
        headerClass: 'dropdown__header',
        titleClass: 'dropdown__title',
        listClass: 'dropdown__list',
        listContainerClass: 'dropdown__list-container',

        onShow: function(dropdown) {},
        onHide: function(dropdown) {},
        onRadioSelected: function(dropdown, radio) {

        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.state = this.states.CLOSED;

    this.mode = this.options.mode;
    this.type = this.options.type;

    this.setOpen = function() {
        this.state = this.states.OPEN;

        return this;
    }

    this.setClosed = function() {
        this.state = this.states.CLOSED;

        return this;
    }

    this.isOpen = function() {
        return this.state == this.states.OPEN;
    }

    this.reset = function() {
        var placeholder = "-";

        if (typeof this.title.attr('data-placeholder') != 'undefined') {
            placeholder = this.title.attr('data-placeholder');
        }

        console.log(placeholder);

        this.title.html(placeholder);

        this.fields.prop('checked', false);



        return this;
    }

    this.show = function(callback) {
        var that = this;

        this.container.addClass(that.options.openClass);

        this.listContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof callback === 'function') {
                    callback(that);
                }

                if (typeof that.options.onShow === 'function') {
                    that.options.onShow(that);
                }
            }
        });

        this.setOpen();

        return this;
    }

    this.hide = function(callback) {
        var that = this;

        this.container.removeClass(that.options.openClass);

        this.listContainer.velocity("slideUp", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof callback === 'function') {
                    callback(that);
                }

                if (typeof that.options.onHide === 'function') {
                    that.options.onHide(that);
                }
            }
        });

        this.setClosed();

        return this;
    }

    this.getChecked = function() {
        return this.fields.filter(':checked');
    }

    this.select = function(field) {
        if (!field.prop('checked')) {
            field.prop('checked', true).trigger('change');
        }

        var description = field.parent().find('.dropdown-item__description').html();

        that.title.html(description);

        that.hide();

        if (typeof that.options.onRadioSelected == 'function') {
            that.options.onRadioSelected(that, field);
        }

        return this;
    }

    this.selectByID = function(id) {
        var selectedInput = that.fields.filter('[value="' + id + '"]');

        this.select(selectedInput);

        return this;
    }

    this.run = function() {
        var that = this;

        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);

        this.fields = this.list.find('input[type="radio"]');

        if (this.options.type == Hawk.DropdownConstants.types.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }

        if (this.options.mode == Hawk.DropdownConstants.modes.CHOOSABLE) {
            this.container.addClass(this.options.choosableModeClass);
        }

        if (this.options.direction == Hawk.DropdownConstants.directions.UPWARDS) {
            this.container.addClass(this.options.upwardsDirectionClass);
        }

        this.hide();

        this.container.click(function(e) {
            e.stopPropagation();
        });

        this.header.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (that.isOpen()) {
                that.hide();
            } else {
                that.show();
            }
        });

        $('body').click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        if (this.fields.length > 0) {
            this.fields.change(function() {
                that.select($(this));
            });

            var defaultChecked = this.fields.filter('[checked="checked"]');

            if (defaultChecked.length > 0) {
                that.select(defaultChecked);
            }
        }

        return true;
    }
}

Hawk.AjaxOverlayerManager = function(id, options) {
    var that = this;

    this.container = $('#' + id);
    this.overlayerId = parseInt(this.container.attr('data-overlayer-id'));

    this.currentContentID;
    this.currentBundle;
    this.currentCallback;

    this.buttons = $('.ajax-overlayer-button[data-overlayer-id=' + this.overlayerId + ']');

    this.inner;
    this.contentWrapper;
    this.contentContainer;
    this.closeButton;
    this.loadingLayer;

    this.currentButton;

    this.baseZIndex = 9000;

    this.open = false;

    this.disabled = false;

    this.ajaxRequest;
    this.ajaxRequestWorking = false;

    this.defaultOptions = {
        fadeSpeed: 400,
        slideSpeed: 400,

        ajaxFilePath: "/ajax.php",
        loadActionName: "load-overlayer",

        innerClass: 'overlayer__inner',
        contentWrapperClass: 'overlayer__content-wrapper',
        contentContainerClass: 'overlayer__content',
        closeButtonClass: 'ajax-overlayer-close',
        loadingLayerClass: 'overlayer__loading-layer',

        onShow: function(overlayerManager) {},
        onHide: function(overlayerManager) {},
        onLoad: function(overlayerManager, id) {},
        onInitialize: function(overlayerManager, hash) {
            var pattern = /[0-9]+\/[0-9]+\/([a-zA-Z0-9\-]+)/

            if (pattern.test(hash)) {
                var parts = hash.split('/');

                var overlayerId = parseInt(parts[0]);
                var id = parseInt(parts[1]);

                if (overlayerId == overlayerManager.getId()) {
                    overlayerManager.loadContent(id);
                }
            }
        },
        createAnchor: function(overlayerManager, id, hash) {
            return overlayerManager.getId() + "/" + id + "/" + hash;
        }
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.popstateDefaultCallback = function() {
        that.hide();
    };

    this.getId = function() {
        return this.overlayerId;
    }

    this.getCurrentContentID = function() {
        return this.currentContentID;
    }

    this.setCurrentContentID = function(id) {
        this.currentContentID = id;

        return this;
    }

    this.getCurrentBundle = function() {
        return this.currentBundle;
    }

    this.setCurrentBundle = function(id) {
        this.currentBundle = id;

        return this;
    }

    this.getCurrentCallback = function() {
        return this.currentCallback;
    }

    this.setCurrentCallback = function(id) {
        this.currentCallback = id;

        return this;
    }

    this.disable = function() {
        this.disabled = true;

        return this;
    }

    this.enable = function() {
        this.disabled = false;

        return this;
    }

    this.isDisabled = function() {
        return this.disabled;
    }

    this.hide = function() {
        var that = this;

        if (this.ajaxRequestWorking) {
            if (typeof this.ajaxRequest != 'undefined') {
                this.ajaxRequest.abort();
            }
        }

        if (this.isDisabled()) {
            return false;
        }

        try {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch(e) {
            window.location.hash = "";
        }

        this.container.velocity("fadeOut", {
            duration: this.options.fadeSpeed,
            complete: function() {
                $('body').css({ 'overflow': 'auto' });

                that.contentContainer.html('').hide();
                that.contentWrapper.css({ opacity: 0 });

                if (typeof that.options.onHide == 'function') {
                    that.options.onHide(that);
                }

                that.currentButton = undefined;

                that.open = false;

                $(window).unbind('popstate', that.popstateDefaultCallback);
            }
        });

        return this;
    }

    this.isOpen = function() {
        return this.open;
    }

    this.changeContent = function(content, callback) {
        var that = this;

        this.contentWrapper.css({ opacity: 0 });
        this.contentContainer.html(content);
        this.contentContainer.show();
        that.contentWrapper.velocity({ opacity: 1 } , {
            duration: 400,
            complete: function() {
                if (typeof callback == 'function') {
                    callback();
                }
            }
        });

        /**this.contentContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                that.contentWrapper.velocity({ opacity: 1 } , {
                    duration: 200
                });
            }
        });**/

        return this;
    }

    this.reload = function() {
        console.log("Overlayer reload");

        this.loadContent(this.getCurrentContentID(), this.getCurrentBundle(), this.getCurrentCallback());

        return this;
    }

    this.loadContent = function(id, bundle, callback) {
        var that = this;
        var lang = $('html').attr('lang');

        this.setCurrentContentID(id);
        this.setCurrentBundle(bundle);
        this.setCurrentCallback(callback);

        that.show();
        that.loadingLayer.show();

        this.ajaxRequestWorking = true;

        if (typeof bundle == 'undefined') {
            bundle = {};
        }

        this.ajaxRequest = $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: { 'action': that.options.loadActionName, 'id': id, 'lang': lang, 'bundle': bundle },
            success: function(result) {
                console.log(result);

                if (result.error > 0) {
                    if (typeof result.message != 'undefined') {
                        noticeManager.error("Error", result.message);

                        that.hide();
                    }

                    return;
                }

                that.changeContent(result.html, callback);

                that.changeHash(id, result.anchor);

                if (typeof that.options.onLoad == 'function') {
                    that.options.onLoad(that, id, result);
                }

                $(window).on('popstate', that.popstateDefaultCallback);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer
                //alert(errorThrown);

                console.log(jqXHR.responseText);
            },
            complete: function() {
                that.loadingLayer.hide();

                that.ajaxRequestWorking = false;
            }
        });

        return this;
    }

    this.parseIntoBundle = function(str) {
        var items = str.split(';');

        var data;

        var result = {};

        for (var i in items) {
            data = items[i].split('=');

            result[data[0]] = data[1];
        }

        return result;
    }

    this.onButtonClick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!that.open) {
            that.currentButton = $(this);

            var id = $(this).attr('data-id');

            var bundle = {};

            if (typeof $(this).attr('data-bundle') != 'undefined') {
                bundle = Hawk.createBundleFromString($(this).attr('data-bundle'));
            }

            that.loadContent(id, bundle);
        }
    }

    this.getButtonsSelector = function() {
        return '.ajax-overlayer-button[data-overlayer-id="' + this.overlayerId + '"]';
    }

    this.refreshDependencies = function() {
        $('body').off('click', this.getButtonsSelector());
        $(this.getButtonsSelector()).unbind('click');

        $(this.getButtonsSelector()).click(this.onButtonClick);
        $('body').on('click', this.getButtonsSelector(), this.onButtonClick);

        return this;
    }

    this.run = function() {
        var that = this;

        this.inner = this.container.find('.' + this.options.innerClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.closeButton = $(this.container.find('.' + this.options.closeButtonClass));
        this.loadingLayer = $(this.container.find('.' + this.options.loadingLayerClass));

        $('body').on('click', this.getButtonsSelector(), that.onButtonClick);

        this.container.click(function() {
            that.hide();
        });

        this.container.on('click', '.' + this.options.closeButtonClass, function(e) {
            e.preventDefault();

            that.hide();
        });

        this.initializeClosePreventer();

        var hash = window.location.hash;

        if (typeof this.options.onInitialize == 'function') {
            this.options.onInitialize(this, hash);
        }

        return true;
    };
}
Hawk.AjaxOverlayerManager.prototype.initializeClosePreventer = function() {
    var that = this;

    this.container.on('click', '.' + that.options.innerClass + ', .' + that.options.innerClass + ' :not(.' + that.options.closeButtonClass + ', .' + that.options.closeButtonClass + ' *)', function(e) {
        e.stopPropagation();

        return;
    });

    return this;
}
Hawk.AjaxOverlayerManager.prototype.show = function() {
    var that = this;

    this.open = true;

    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            $('body').css({ 'overflow': 'hidden' });

            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });

    return this;
}
Hawk.AjaxOverlayerManager.prototype.changeHash = function(id, anchor) {
    var that = this;

    if (typeof anchor != 'undefined' && anchor != null && anchor.length > 0) {
        window.location.hash = that.options.createAnchor(that, id, anchor);
    }

    return this;
}

Hawk.PopUp = function(container, options) {
    Hawk.AjaxOverlayerManager.call(this, container, options);
}
Hawk.PopUp.prototype.show = function() {
    var that = this;

    this.open = true;

    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });

    return this;
}
Hawk.PopUp.prototype.initializeClosePreventer = function() {
    return this;
}
Hawk.PopUp.prototype.changeHash = function(id, anchor) {
    return this;
}

Hawk.NoticeManager = function() {
    this.popup = new Hawk.PopUp('notice-popup', {
        loadActionName: 'load-popup',
        ajaxFilePath: '/ajax/request/notice',
    });
    this.popup.run();

    this.success = function(title, content) {
        this.popup.loadContent('success', {
            title: title,
            content: content
        });
    }

    this.error = function(title, content) {
        this.popup.loadContent('error', {
            title: title,
            content: content
        });
    }
}

var noticeManager = new Hawk.NoticeManager();

Hawk.AjaxRequestManager = function(path, options) {
    var that = this;

    this.path = path;

    this.requestLinks;
    this.spinner;

    this.operations = {

    };

    this.ajaxRequest;
    this.ajaxRequestWorking = false;

    this.defaultOptions = {
        spinnerClass: 'ajax-request-manager-spinner',

        onError: function() {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.registerOperation = function(name, operation) {
        this.operations[name] = operation;

        return this;
    }

    this.sendSimpleRequest = function(operation, element) {
        var data = that.collectData(operation, element);

        return that.sendRequest({ operation: operation }, { bundle: data });
    }

    this.sendRequest = function(generalData, moduleData) {
        if (this.ajaxRequestWorking) {
            //console.log("The request is already been doing!");

            return false;
        }

        this.ajaxRequestWorking = true;

        var that = this;

        var data = Hawk.mergeWholeObjects(generalData, moduleData);

        this.spinner.show();

        this.ajaxRequest = $.ajax({
            type: "POST",
            url: this.path,
            dataType: "json",
            data: data,
            success: function(result) {
                console.log(result);

                if (typeof result.error != 'undefined') {
                    if (!result.error) {
                        that.operations[result.operation].callback(result);
                    } else {
                        noticeManager.error("Error", result.message);
                    }
                } else {
                    noticeManager.error("Error", "There occured technical error. Try again later.");
                }


                /**if(!result.error) {

                    } else {
                        that.errorMessage.setContent(result.message);
                        that.errorMessage.show();
                    }**/

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                that.options.onError();
            },
            complete: function() {
                that.ajaxRequestWorking = false;

                that.spinner.hide();
            }
        });

        return this;
    }

    this.collectData = function(operation, element) {
        return that.operations[operation].collectData(element);
    }

    this.refreshDependencies = function() {
        var that = this;

        this.requestLinks = $('.ajax-request-button');

        this.spinner = $('.' + this.options.spinnerClass);

        this.requestLinks.unbind('click').click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var operation = $(this).attr('data-operation');

            that.spinner = $(this).parent().find('.ajax-request-spinner');

            var data = that.collectData(operation, $(this));

            that.sendRequest({ operation: operation }, { bundle: data });
        });
    }

    this.run = function() {
        this.refreshDependencies();
    }
}

var ajaxRequestManager = new Hawk.AjaxRequestManager("/ajax/request", {
    onError: function() {
        noticeManager.error("Error", "There occured some technical error.");
    }
});
ajaxRequestManager.run();

Hawk.MoreContentManager = function(id, options) {
    var that = this;

    this.id = id;
    this.lastItemId = 0;
    this.done = false;

    this.buttons;
    this.contentContainer;

    this.defaultOptions = {
        itemsPerLoading: 10,

        loadActionName: 'load-more-content',
        ajaxFilePath: '/ajax.php',

        buttonClass: 'more-content-button',
        contentContainerClass: 'more-content-container',

        slideSpeed: 400,
        fadeSpeed: 400,

        onLoad: function(button, contentContainer) {},
        onDone: function(button, contentContainer) {},

        appendContent: function(mcm, content) {
            content.hide();
            content.css({ opacity: 0 });

            mcm.contentContainer.append(content);

            content.velocity("slideDown", {
                duration: that.options.slideSpeed,
                complete: function() {
                    content.velocity({ opacity: 1 }, {
                        duration: that.options.fadeSpeed
                    });
                }
            });
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.load = function(lastItemId) {
        var that = this;
        var lang = $('html').attr('lang') || "pl";

        $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: { 'action': that.options.loadActionName, 'id': id, 'lang': lang, 'lastItemId': lastItemId },
            success: function(result) {
                if (result.error > 0) {
                    // here should appear error layer
                    return;
                }

                console.log(result);

                that.appendContent(result['html']);

                that.lastItemId = result['lastItemId'];

                that.setDone(result['isDone']);

                if (typeof that.options.onLoad == 'function') {
                    that.options.onLoad(that.buttons, that.contentContainer);
                }

                if (that.isDone() && typeof that.options.onDone == 'function') {
                    that.options.onDone(that.buttons, that.contentContainer);
                }                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer
                //alert(errorThrown);
            },
            complete: function() {
                
            }
        });
    }

    this.appendContent = function(content) {
        content = $(content);

        content = content.filter(function() {
            return this.nodeType != 3; // Node.TEXT_NODE
        });

        this.options.appendContent(this, content);
    }

    this.isDone = function() {
        return this.done;
    }

    this.setDone = function(isDone) {
        this.done = isDone;

        return this;
    }

    this.run = function() {
        this.buttons = $('.' + this.options.buttonClass + '[data-id="' + this.id + '"]');
        this.contentContainer = $('.' + this.options.contentContainerClass + '[data-id="' + this.id + '"]');
    
        this.buttons.click(function(e) {
            console.log("clicked");

            e.preventDefault();

            if (!that.isDone()) {
                that.load(that.lastItemId);
            }
        });
    }
}

Hawk.AjaxMoreContentManager = function(id, options) {
    this.id = id;
    this.buttons = $('.more-content-button[data-id="' + this.id + '"]');
    this.contentContainer = $('.more-content-container[data-id="' + this.id + '"]');

    this.lastRowId = 0;
    this.isDone = false;

    this.defaultOptions = {
        slideSpeed: 400,
        fadeSpeed: 400,

        itemsPerLoading: 8,

        onDone: function(button) {
            button.velocity({ opacity: 0 }, {
                duration: 400,
                complete: function() {
                    button.css({ visibility: 'hidden' });
                }
            });
        },
        onShow: function(contentsContainer, button) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.defaultOnLoad = function(items) {
        items.css({ display: 'none' });
        items.css({ opacity: 0 });

        this.contentContainer.append(items);

        
    }

    this.show = function() {
        var that = this;

        var currentButton = this.buttons.filter('[data-id="' + id + '"]');
        var currentContent = this.contents.filter('[data-id="' + id + '"]');

        currentContent.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                currentContent.velocity({ opacity: 1 }, {
                    duration: that.options.fadeSpeed,
                    complete: function() {
                        currentContent.attr('data-state', that.states.VISIBLE);
                    }
                });
            }
        });

        if (typeof that.options.onShow == 'function') {
            that.options.onShow(currentButton);
        }

        return this;
    }

    this.run = function() {
        var that = this;

        this.buttons.show();
        this.contents.hide().css({ opacity: 0 });

        this.contents.attr('data-state', this.states.HIDDEN);

        if (typeof this.buttons == 'undefined' || typeof this.contents == 'undefined') {
            return false;
        }

        this.buttons.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var currentId = $(this).attr('data-id');

            if (that.isHidden(currentId)) {
                that.show(currentId);
            } else {
                that.hide(currentId);
            }
        });

        return true;
    }
}

Hawk.SlideMenu = function(id, options) {
    this.menu = $('#' + id);
    this.wrapper = this.menu.find('> div');

    this.mode;
    this.direction;
    this.state;

    this.toggler;
    this.close;
    this.directionClassName;
    this.modeClassName;
    this.openClassName;

    this.states = {
        closed: 'closed',
        open: 'open'
    };

    this.modes = {
        slideFade: 'slide-fade',
        slide: 'slide',
        fade: 'fade'
    };

    this.directions = {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left'
    };

    this.defaultOptions = {
        slideDuration: 500,
        fadeDuration: 500,
        direction: 'top',
        mode: 'slide',
        toggler: $('.menu-toggler'),
        close: this.menu.find('.menu-close'),
        mainClass: 'slide-menu',
        showCallback: function(menu) {},
        hideCallback: function(menu, hideCall) {
            hideCall();
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function() {
        var that = this;

        var timeRemaining = this.totalDuration();

        setTimeout(function() {
            that.options.showCallback(that.menu);
        }, timeRemaining);

        if(this.options.mode == this.modes.fade) {
            this.menu.velocity("fadeIn", {
                duration: this.options.fadeDuration
            });
        }

        this.menu.addClass(this.openClassName);
        this.state = this.states.open;

        this.toggler.addClass('open');
        this.toggler.find('.icon-hamburger').addClass('open');

        return this;
    }

    this.hide = function() {
        var that = this;

        this.options.hideCallback(this.menu, function() {
            if(that.options.mode == that.modes.fade) {
                that.menu.velocity("fadeOut", {
                    duration: that.options.fadeDuration
                });
            }

            that.menu.removeClass(that.openClassName);
        });

        this.state = this.states.closed;

        this.options.toggler.removeClass('open');
        this.options.toggler.find('.icon-hamburger').removeClass('open');

        return this;
    }

    this.totalDuration = function() {
        if(this.options.mode == this.modes.slide) {
            return this.options.slideDuration;
        } else if(this.options.mode == this.modes.slideFade) {
            return this.options.slideDuration + this.options.fadeDuration;
        } else if(this.options.mode == this.modes.fade) {
            return this.options.fadeDuration;
        } else {
            return 0;
        }
    }

    this.run = function() {
        var that = this;

        this.toggler = this.options.toggler;
        this.close = this.options.close;

        this.modeClassName = this.options.mainClass + "--" + this.options.mode;
        this.directionClassName = this.options.mainClass + "--" + this.options.direction;
        this.openClassName = this.options.mainClass + "--open";

        this.menu.addClass(this.directionClassName);
        this.menu.addClass(this.modeClassName);

        this.hide();

        this.toggler.click(function() {
            if(that.state == that.states.open) {
                that.hide();
            } else {
                that.show();
            }
        });

        this.close.click(function() {
            that.hide();
        });

        return this;
    }
}

Hawk.initializeAnchors = function(options) {
    var that = this;

    var defaultOptions = {
        delay: 100,
        menu: undefined
    }

    options = Hawk.mergeObjects(defaultOptions, options);

    $('a').unbind('click').click(function(e) {
        var regex = /#{1}.+$/;
        var link = this;

        var href = $(this).attr('href');
        var anchor;
        var extraDelay = 0;

        if(anchor = regex.exec(href)) {
            if($(anchor + that.anchorSufix).length) {
                e.preventDefault();

                if(options.menu !== undefined && $(link).parents(options.menu.menu).length) {
                    extraDelay = options.menu.totalDuration();

                    options.menu.hide();   
                }

                var finalDelay = options.delay + extraDelay;

                that.scrollToElement({ anchor: anchor + that.anchorSufix, callback: function() { window.location.hash = anchor; }, delay: finalDelay });
            }
        }
    });

    return this;
}

Hawk.BookmarksManager = function(container, options) {
    this.container = $(container);
    this.content;
    this.contentWrapper;
    this.bookmarks;

    this.current; // current bookmark container
    this.currentHeight = 0;

    this.loading = false;

    var that = this;

    this.defaultOptions = {
        responsive: true,
        activeScroll: false,

        activeScrollWidth: 480,
        slideDuration: 200,
        fadeDuration: 200,

        activeBookmarkClass: 'active',
        bookmarksClass: 'bookmarks-manager__bookmark-container',
        contentClass: 'bookmarks-manager__content',
        contentWrapperClass: 'bookmarks-manager__content-wrapper',

        bookmarkClass: 'bookmarks-manager__bookmark',
        bookmarkContentClass: 'bookmarks-manager__bookmark-content',

        bookmarkActiveCallback: function(bookmarkContainer) {},
        bookmarkUnactiveCallback: function(bookmarkContainer) {},
        changeContentCallback: function(content) {},
        changeBookmarkCallback: function(bookmarkContainer) {}
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.isResponsive = function() {
        return this.options.responsive;
    }

    this.isSmallDevice = function() {
        return (this.isResponsive() && !this.content.is(':visible'));
    }

    this.changeContent = function(content, callback) {
        var container = this.content;

        var showing = function() {
            container.hide();
            container.html(content.show());

            container.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    container.velocity({ opacity: 1 }, {
                        duration: that.options.fadeDuration,
                        complete: function() {
                            var currentHeight = that.content.outerHeight();

                            that.currentHeight = currentHeight;
                            that.contentWrapper.css({ 'min-height': that.currentHeight + "px" });

                            that.options.changeContentCallback(that.content);

                            that.loading = false;
                        }
                    });
                }
            });
        }

        if(container.css('opacity') != 0) {
            container.velocity({ opacity: 0 }, {
                duration: that.options.fadeDuration,
                complete: function() {
                    container.html('');
                    showing();
                }
            });
        } else {
            showing();
        }

        if(this.options.activeScroll && Hawk.w < this.options.activeScrollWidth) {
            var id = this.content.attr('id');

            if(id !== undefined) {
                Hawk.scrollToElement({ anchor: '#' + id });
            }
        }
        
        return this;
    }

    this.changeBookmark = function(bookmarkContainer) {
        this.unsetBookmarkActive();

        this.current = bookmarkContainer;

        var bookmark = this.current.find('.' + this.options.bookmarkClass);
        var content = this.current.find('.' + this.options.bookmarkContentClass);

        this.setBookmarkActive(this.current);

        if(this.isSmallDevice()) {
            content.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    that.options.changeContentCallback(content);

                    that.loading = false;
                }
            });
        } else {
            this.changeContent(content.clone(true));
        }

        return this;
    }

    this.unsetBookmarkActive = function() {
        if(this.current !== undefined) {
            var current = this.current;
            current.find('.' + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);

            current.find('.' + this.options.bookmarkContentClass).velocity("slideUp", {
                duration: that.options.slideDuration
            });

            this.current = undefined;

            this.options.bookmarkUnactiveCallback(current);
        }

        return this;
    }

    this.setBookmarkActive = function(bookmarkContainer) {
        var bookmark = bookmarkContainer.find('.' + this.options.bookmarkClass);

        bookmark.addClass(this.options.activeBookmarkClass);

        this.options.bookmarkActiveCallback(bookmarkContainer);

        return this;
    }

    this.launchBookmark = function(n) {
        this.changeBookmark(this.bookmarks.eq(n));

        return this;
    }

    this.updateOptions = function(options) {
        this.options = Hawk.mergeObjects(this.options, options);

        return this;
    }

    this.clear = function(callback) {
        //this.current = undefined;

        this.unsetBookmarkActive();
        this.content.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                if(callback !== undefined) {
                    callback();
                }
            }
        });

        return this;
    }

    this.remindActiveBookmark = function() {
        if(this.isSmallDevice()) {

        }

        return this;
    }

    this.refresh = function() {
        var current = this.current;

        if(current !== undefined) {
            this.clear(function() {
                that.changeBookmark(current);
            });
        }
        
        return this;
    }

    this.run = function() {
        this.bookmarks = this.container.find('.' + this.options.bookmarksClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);

        var refresh;

        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });

        this.bookmarks.click(function() {
            if(that.loading == true) {
                return;
            }

            if(that.current !== undefined && that.current.is($(this))) {
                that.remindActiveBookmark();
            } else {
                that.changeBookmark($(this));
                that.loading = true;
            }
        });

        return this;
    }
}

Hawk.DetailsList = function(container, options) {
    this.container = $(container);
    this.titles;
    this.contents;

    this.current;

    this.states = {
        open: 'open',
        closed: 'closed'
    }

    this.defaultOptions = {
        itemClass: 'details-list__item',
        titleClass: 'details-list__title',
        contentClass: 'details-list__content',
        activeClass: 'active',
        hideOther: true,
        duration: 200,
        showCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--down').addClass('icon-arrow--up');
        },
        hideCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--up').addClass('icon-arrow--down');
        }
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function(title) {
        if(this.options.hideOther && this.current !== undefined) {
            var recent = this.current;
            this.hide(recent);
        }

        this.current = title;

        var that = this;

        var container = this.current.parents('.' + that.options.itemClass).first();
        container.addClass(this.options.activeClass);

        var content = this.current.siblings('.' + this.options.contentClass);

        this.options.showCallback(container);

        content.velocity("slideDown", {
            duration: that.options.duration,
            complete: function() {
                that.current.attr('data-state', that.states.open);
            }
        });

        return this;
    }

    this.hide = function(title) {
        var that = this;

        var container = title.parents('.' + that.options.itemClass).first();
        container.removeClass(this.options.activeClass);

        this.options.hideCallback(container);

        var content = title.siblings('.' + this.options.contentClass);
        content.velocity("slideUp", {
            duration: that.options.duration,
            complete: function() {
                title.attr('data-state', that.states.closed);
            }
        });

        return this;
    }

    this.run = function() {
        var that = this;

        this.titles = this.container.find('.' + this.options.titleClass);
        this.contents = this.container.find('.' + this.options.contentClass);

        this.contents.hide();

        this.titles.click(function() {
            if($(this).attr('data-state') == that.states.open) {
                that.hide($(this));
            } else {
                that.show($(this));
            }
        });

        return this;
    }
}

Hawk.CategorizedItems = function(container, options) {
    this.container = $(container);
    this.categories = this.container.find('[data-category-id]');
    this.items;
    this.noItems;
    this.contentContainer;
    this.content;

    this.selectedItems;
    this.recentItems;
    this.currentCategory;
    this.currentBookmark;

    this.defaultOptions = {
        allId: 'all',
        prefix: "cat-",
        amountInRow: {
            0: 1,
            550: 2,
            768: 3,
            1100: 4
        },
        itemClass: "categorized-items__item",
        noItemsClass: "categorized-items__no-items",
        contentContainerClass: "categorized-items__contents-container",
        contentClass: "categorized-items__contents",
        activeBookmarkClass: "active",
        slideSpeed: 500,
        fadeSpeed: 200,
        smallDeviceWidth: 480,
        scrollOnSmallDevice: true
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.loadCategory = function(id) {
        var that = this;

        this.currentCategory = id;
        this.recentItems = this.selectedItems;

        if(this.currentCategory == this.options.allId) {
            this.selectedItems = this.items;
        } else {
            this.selectedItems = this.items.filter('.cat-' + this.currentCategory);
        }

        this.activateBookmark(this.currentCategory);

        if(that.selectedItems.length > 0) {
            var itemsPerRow = this.countItemsPerRow();

            var rowAmount = Math.ceil(this.selectedItems.length/itemsPerRow);
            var itemHeight = this.selectedItems.first().outerHeight();

            var necessaryHeight = rowAmount * itemHeight;

            if(necessaryHeight < this.contentContainer.outerHeight()) {
                this.contentContainer.css({ 'min-height': necessaryHeight + "px" });
            }

            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.noItems.hide();
                    that.items.hide();
                    that.selectedItems.show();

                    if(that.options.scrollOnSmallDevice && Hawk.w < that.options.smallDeviceWidth) {
                        var containerId = that.contentContainer.attr('id');

                        if(containerId !== undefined) {
                            console.log(containerId);

                            Hawk.scrollToElement({ anchor: '#' + containerId });
                        }                        
                    }

                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed,
                        complete: function() {
                            that.contentContainer.css({ 'min-height': necessaryHeight + "px" });
                        }
                    });
                }
            });
        } else {
            var containerMinHeight = that.noItems.outerHeight();
            this.contentContainer.css( { 'min-height': containerMinHeight + "px" });

            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.items.hide();
                    that.noItems.show();

                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed
                    });
                }
            });
        }

        return this;
    }

    this.activateBookmark = function(id) {
        if(this.currentBookmark !== undefined) {
            this.currentBookmark.removeClass(this.options.activeBookmarkClass);
        }
        
        this.currentBookmark = this.categories.filter('[data-category-id="' + id + '"]');
        this.currentBookmark.addClass(this.options.activeBookmarkClass);

        return this;
    }

    this.countItemsPerRow = function() {
        var amount = 0;

        var object = this.options.amountInRow;

        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if(property > Hawk.w) {
                    return amount;
                }

                amount = object[property];
            }
        }

        return amount;
    }

    this.refresh = function() {
        var itemsPerRow = this.countItemsPerRow();
        var itemWidth = 1/itemsPerRow * 100;

        this.items.css({ width: itemWidth + "%" });

        return this;
    }

    this.run = function() {
        var that = this;

        this.items = this.container.find('.' + this.options.itemClass);
        this.noItems = this.container.find('.' + this.options.noItemsClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);

        this.selectedItems = this.items;
        this.noItems.hide();

        this.refresh();

        var refresh;

        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });

        this.categories.click(function() {
            var id = $(this).attr('data-category-id');

            that.loadCategory(id);
        });

        this.loadCategory(this.options.allId);

        return this;
    }
}

Hawk.formFieldTypes = {
    TEXT: 'text',
    PASSWORD: 'password',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    FILE: 'file',
    HIDDEN : 'hidden'
};

Hawk.FormField = function(name, type, wrapperSelector, required, callback) {
    var that = this;

    this.name = name;
    this.type = type;
    this.wrapperSelector = wrapperSelector;
    this.required = required;
    this.callback = callback;

    this.wrapper;
    this.field;

    this.errorClass = "error";

    this.getWrapper = function() {
        if (typeof this.wrapperSelector == 'function') {
            return this.wrapperSelector(this.field);
        } else {
            return this.field.parents('.' + this.wrapperSelector);
        }
    }

    this.bind = function(form) {
        if (this.type == Hawk.formFieldTypes.TEXTAREA) {
            this.field = $(form).find('textarea[name="' + this.name + '"]');
        } else if (this.type == Hawk.formFieldTypes.CHECKBOX) {
            this.field = $(form).find('input[name="' + this.name + '"]');

            if(this.field.length == 0) {
                this.field = $(form).find('input[name="' + this.name + '[]"]');
            }
        } else if (this.type == Hawk.formFieldTypes.SELECT) {
            this.field = $(form).find('select[name="' + this.name + '"]');
        } else {
            this.field = $(form).find('input[name="' + this.name + '"]');
        }

        if (this.field.length > 0) {
            this.wrapper = this.getWrapper();
        }
    }

    this.isBinded = function() {
        return (this.wrapper !== undefined && this.field !== undefined);
    }

    this.disable = function() {
        if (this.isBinded()) {
            this.field.attr('disabled', 'disabled');
        }

        return this;
    }

    this.validate = function() {
        if (callback !== undefined) {
            if(that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO || that.type == Hawk.formFieldTypes.FILE) {
                return callback(that.field, that.wrapper);
            } else {
                return callback(that.field.val());
            }
        }

        return true;
    }

    this.markIncorrect = function() {
        this.wrapper.addClass(this.errorClass);

        return this;
    }

    this.clear = function() {
        this.wrapper.removeClass(this.errorClass);

        return this;
    }

    this.clearField = function() {
        if(that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO) {
            this.field.attr('checked', false);
        } else if (that.type == Hawk.formFieldTypes.SELECT) {
            this.field.val(0);
        } else {
            this.field.val('');
        }

        return this;
    }

    this.run = function(form) {
        this.bind(form);

        this.field.change(function() {
            if (that.validate()) {
                that.clear();
            } else {
                that.markIncorrect();
            }
        });
    }
}

Hawk.FormSender = function(element, fields, options) {
    var that = this;

    this.form = $(element).first();

    this.id = this.form.attr('id');
    this.rawForm = this.form.get(0);

    this.fields = fields;

    this.defaultOptions = {
        ajaxPath: '/ajax.php',
        extraData: {},
        incorrectFieldClass: 'error',
        button: that.form.find('button[type="submit"]'),
        cancelButton: that.form.find('button.form__cancel'),
        infoContainerClass: 'form__info-container',
        infoWrapperClass: 'form__info-wrapper',
        infoClass: 'form__info',
        spinnerClass: 'form__spinner',
        correctCallback: function() {},
        errorCallback: function() {},
        exceptionCallback: function() {},
        callback: function() {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.infoContainer = this.form.find('.' + this.options.infoContainerClass);
    this.infoWrapper = this.form.find('.' + this.options.infoWrapperClass);
    this.info = this.form.find('.' + this.options.infoClass);
    this.spinner = this.form.find('.' + this.options.spinnerClass);
    this.button = this.options.button;
    this.cancelButton = this.options.cancelButton;

    this.validate = function() {
        var result = true;

        for (var i in this.fields) {
            var current = this.fields[i];

            if (!current.validate()) {
                current.markIncorrect();

                result = false;
            } else {
                current.clear();
            }
        }

        return result;
    }

    this.clear = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.clear();
        }

        return this;
    }

    this.clearFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.clearField();
        }

        return this;
    }

    this.checkFields = function(incorrectFields) {
        for (var i in this.fields) {
            var current = this.fields[i];

            if (Hawk.isInObject(current.name, incorrectFields)) {
                current.markIncorrect();
            } else {
                current.clear();
            }
        }

        return this;
    }

    this.changeMessage = function(message) {
        var showing = function() {
            that.info.html(message);

            that.infoWrapper.velocity("slideDown", {
                duration: 200,
                complete: function() {
                    that.infoContainer.css({ 'min-height': that.infoContainer.outerHeight() + "px" });

                    that.showMessage();
                }
            });
        }

        if (this.infoWrapper.is(':hidden')) {
            showing();
        } else {
            that.hideMessage(showing);
        }

        return this;
    }

    this.showMessage = function(message) {
        that.info.velocity({ opacity: 1 }, {
            duration: 200
        });

        return this;
    }

    this.hideMessage = function(callback) {
        this.info.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                if (callback !== undefined) {
                    callback();
                }
            }
        });

        return this;
    }

    this.clearMessage = function(callback) {
        this.info.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                that.infoWrapper.velocity("slideUp", {
                    duration: 200,
                    complete: function() {
                        that.infoContainer.css({ 'min-height': 0 });

                        if (callback !== undefined) {
                            callback();
                        }
                    }
                });
            }
        });

        return this;
    }

    this.hideButton = function() {
        this.button.add(this.cancelButton).velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                that.button.css({ visibility: 'hidden' });
            }
        });
    }

    this.disable = function() {
        this.form.attr('disabled', 'disabled');

        this.form.find('input, textarea').attr('disabled', 'disabled');

        return this;
    }

    this.send = function() {
        this.spinner.show();

        var data = new FormData(that.rawForm);

        for (var key in that.options.extraData) {
            data.append(key, that.options.extraData[key]);
        }


        $.ajax({
            url: that.options.ajaxPath,
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: function(result) {
                //console.log(result);

                if (!result.error) {
                    that.clear();

                    that.hideButton();

                    that.disable();

                    if (typeof that.options.correctCallback == 'function') {
                        that.clearMessage();
                        that.options.correctCallback(result);
                    } else {
                        that.changeMessage(result.message);
                    }
                } else {
                    that.checkFields(result.errorFields);

                    that.changeMessage(result.message);

                    if (typeof that.options.errorCallback == 'function') {
                        that.options.errorCallback(result);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                that.changeMessage("Wystąpił nieoczekiwany problem podczas wysyłania wiadomości. Proszę spróbować ponownie później.");

                if (typeof that.options.exceptionCallback == 'function') {
                    that.options.exceptionCallback();
                }

                console.log(errorThrown);
            },
            complete: function(jqXHR) {
                that.spinner.hide();
            }
        });
    }

    this.bindFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.run(that.form);
        }

        return this;
    }

    this.run = function() {
        this.bindFields();

        this.form.submit(function(e) {
            e.preventDefault();

            that.send();
        });

        this.cancelButton.click(function() {
            that.clearFields();
        });
    }
}

Hawk.refresh = function() {
    this.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh;

    return this;
}

Hawk.run = function() {
    var that = this;

    var pageLoadingLayer = $('#page-loading-layer');
    pageLoadingLayer.velocity("fadeOut", {
        duration: 1000
    });

    if(this.hash.length != 0) {
        this.scrollToElement({ anchor: this.hash + this.anchorSufix, delay: 200 });
    }

    $(window).resize(function() {
        that.refresh();
    });

    return this;
}