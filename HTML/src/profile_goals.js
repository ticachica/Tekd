/*
 * JS for profile_goals generated by Exadel Tiggzi
 *
 * Created on: Monday, October 29, 2012, 11:18:22 PM (PDT)
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
j_10_js = function(runBeforeShow) { /* Object & array with components "name-to-id" mapping */
    var n2id_buf = {
        'mobilelabel4': 'j_14',
        'mobilecheckboxgroup2': 'j_15',
        'mobilecheckbox7': 'j_16',
        'mobilecheckbox8': 'j_17',
        'mobilecheckbox9': 'j_18',
        'mobilecheckbox10': 'j_19',
        'mobilecheckbox11': 'j_20',
        'mobilecheckbox12': 'j_21',
        'mobilebutton5': 'j_22'
    };
    if ("n2id" in window && window.n2id !== undefined) {
        $.extend(n2id, n2id_buf);
    } else {
        window.n2id = n2id_buf;
    }
    Tiggr.CurrentScreen = 'j_10';
    /*************************
     * NONVISUAL COMPONENTS  *
     *************************/
    var datasources = [];
    /************************
     * EVENTS AND HANDLERS  *
     ************************/
    j_10_beforeshow = function() {
        Tiggr.CurrentScreen = 'j_10';
        for (var idx = 0; idx < datasources.length; idx++) {
            datasources[idx].__setupDisplay();
        }
    }
    // screen onload
    screen_31B6_onLoad = j_10_onLoad = function() {
        screen_31B6_elementsExtraJS();
        j_10_windowEvents();
        screen_31B6_elementsEvents();
    }
    // screen window events
    screen_31B6_windowEvents = j_10_windowEvents = function() {
        $('#j_10').bind('pageshow orientationchange', function() {
            adjustContentHeightWithPadding();
        });
    }
    // screen elements extra js
    screen_31B6_elementsExtraJS = j_10_elementsExtraJS = function() {
        // screen (screen-31B6) extra code
    }
    // screen elements handler
    screen_31B6_elementsEvents = j_10_elementsEvents = function() {
        $("a :input,a a,a fieldset label").live({
            click: function(event) {
                event.stopPropagation();
            }
        });
        $('#j_13 [name="mobilebutton5"]').die().live({
            click: function() {
                if (!$(this).attr('disabled')) {
                    Tiggr.navigateTo('videogrid', {
                        reverse: false
                    });
                }
            },
        });
    }
    $("#j_10").die("pagebeforeshow").live("pagebeforeshow", function(event, ui) {
        j_10_beforeshow();
    });
    if (runBeforeShow) {
        j_10_beforeshow();
    } else {
        j_10_onLoad();
    }
}
$("#j_10").die("pageinit").live("pageinit", function(event, ui) {
    j_10_js();
});