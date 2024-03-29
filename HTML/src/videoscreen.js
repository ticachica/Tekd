/*
 * JS for videoscreen generated by Exadel Tiggzi
 *
 * Created on: Monday, October 29, 2012, 11:18:23 PM (PDT)
 */
/************************************
 * JS API provided by Exadel Tiggzi  *
 ************************************/
/* Setting project environment indicator */
Tiggr.env = "bundle";
Tiggr.getProjectGUID = function() {
    return '875eb6fa-5d87-4bb4-b69d-08d7c2a5a2d7';
}
Tiggr.getTargetPlatform = function() {
    return '0';
}

function navigateTo(outcome, useAjax) {
    Tiggr.navigateTo(outcome, useAjax);
}

function adjustContentHeight() {
    Tiggr.adjustContentHeight();
}

function adjustContentHeightWithPadding() {
    Tiggr.adjustContentHeightWithPadding();
}

function setDetailContent(pageUrl) {
    Tiggr.setDetailContent(pageUrl);
}
/**********************
 * SECURITY CONTEXTS  *
 **********************/
/*******************************
 *      SERVICE SETTINGS        *
 ********************************/
var Tout_Settings = {
    "suid": "gfln7u",
    "suid1": "97ayb0"
}
/*************************
 *      SERVICES          *
 *************************/
var UG = new Tiggr.RestService({
    'url': 'http://api.usergrid.com/token',
    'dataType': 'json',
    'type': 'get',
});
var GetApigeeResources = new Tiggr.RestService({
    'url': 'https://api.usergrid.com/outdated/tekd/users',
    'dataType': 'json',
    'type': 'get',
});
var Twitter = new Tiggr.RestService({
    'url': 'http://search.twitter.com/search.json',
    'dataType': 'json',
    'type': 'get',
});
var Keen = new Tiggr.RestService({
    'url': 'https://api.keen.io/3.0/projects/508c42a9897a2c14a4000003/events/learningtypeselections',
    'dataType': 'json',
    'type': 'post',
    'contentType': 'application/json',
});
var getApigeeResults = new Tiggr.RestService({
    'url': 'https://api.usergrid.com/outdated/tekd/courses',
    'dataType': 'json',
    'type': 'get',
});
var GetApigeetoken = new Tiggr.RestService({
    'url': 'http://api.usergrid.com/outdated/tekd/token',
    'dataType': 'json',
    'type': 'get',
});
var Tout = new Tiggr.RestService({
    'url': 'https://api.tout.com/api/v1/touts/{uid}',
    'dataType': 'json',
    'type': 'get',
    'serviceSettings': Tout_Settings
});
createSpinner("files/resources/lib/jquerymobile/images/ajax-loader.gif");
Tiggr.AppPages = [{
    "name": "profile_goals",
    "location": "profile_goals.html"
}, {
    "name": "profile_designcomp",
    "location": "profile_designcomp.html"
}, {
    "name": "profile_codecomp",
    "location": "profile_codecomp.html"
}, {
    "name": "profile_ethnicity",
    "location": "profile_ethnicity.html"
}, {
    "name": "videogrid",
    "location": "videogrid.html"
}, {
    "name": "profile_gender",
    "location": "profile_gender.html"
}, {
    "name": "videoscreen",
    "location": "videoscreen.html"
}, {
    "name": "profile_Age",
    "location": "profile_Age.html"
}, {
    "name": "results_page",
    "location": "results_page.html"
}, {
    "name": "startScreen",
    "location": "startScreen.html"
}];
j_101_js = function(runBeforeShow) { /* Object & array with components "name-to-id" mapping */
    var n2id_buf = {
        'mobilevideo1': 'j_105'
    };
    if ("n2id" in window && window.n2id !== undefined) {
        $.extend(n2id, n2id_buf);
    } else {
        window.n2id = n2id_buf;
    }
    Tiggr.CurrentScreen = 'j_101';
    /*************************
     * NONVISUAL COMPONENTS  *
     *************************/
    var datasources = [];
    /************************
     * EVENTS AND HANDLERS  *
     ************************/
    j_101_beforeshow = function() {
        Tiggr.CurrentScreen = 'j_101';
        for (var idx = 0; idx < datasources.length; idx++) {
            datasources[idx].__setupDisplay();
        }
    }
    // screen onload
    screen_CABC_onLoad = j_101_onLoad = function() {
        screen_CABC_elementsExtraJS();
        var video = $('source', Tiggzi('mobilevideo1'));
        console.log('---------');
        $($(video)[0]).attr('src', localStorage['video_src']).attr('type', 'video/mp4');
        $($(video)[1]).attr('src', localStorage['video_src']).attr('type', 'video/mp4');
        j_101_windowEvents();
        screen_CABC_elementsEvents();
    }
    // screen window events
    screen_CABC_windowEvents = j_101_windowEvents = function() {
        $('#j_101').bind('pageshow orientationchange', function() {
            adjustContentHeightWithPadding();
        });
    }
    // screen elements extra js
    screen_CABC_elementsExtraJS = j_101_elementsExtraJS = function() {
        // screen (screen-CABC) extra code
    }
    // screen elements handler
    screen_CABC_elementsEvents = j_101_elementsEvents = function() {
        $("a :input,a a,a fieldset label").live({
            click: function(event) {
                event.stopPropagation();
            }
        });
    }
    $("#j_101").die("pagebeforeshow").live("pagebeforeshow", function(event, ui) {
        j_101_beforeshow();
    });
    if (runBeforeShow) {
        j_101_beforeshow();
    } else {
        j_101_onLoad();
    }
}
$("#j_101").die("pageinit").live("pageinit", function(event, ui) {
    j_101_js();
});