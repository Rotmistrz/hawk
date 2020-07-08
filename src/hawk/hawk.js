var Hawk = {};

Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

    hash: window.location.hash,
    anchorSufix: '-anchor',
}

Hawk.Constants = {
    COMPONENT_ID_ATTRIBUTE: "data-component-id"
};

Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};