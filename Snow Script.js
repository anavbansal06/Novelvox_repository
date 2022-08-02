/*! RESOURCE: /scripts/openframe/latest/openFrameAPI.min.js */
/*! openFrameAPI v1.0.2 | (c) 2014-2018 [ServiceNow], All Rights Reserved */
var SNC;
(SNC = window.SNC || {}).DataValidation = function() {
    var e = 256,
        n = 4400,
        t = ["sysparm_stack", "sysparm_goto_url"];

    function i(e) {
        throw e
    }
    return {
        contains: function(e, n) {
            for (var t in e)
                if (e.hasOwnProperty(t) && e[t] == n) return !0;
            return !1
        },
        stringValidation: function(n, t, o) {
            return "string" != typeof n && i("Input is incorrect. Only string is supported"), t && o ? n.length > o && i("Length cannot be more than " + o) : t && n.length > e && i("Length cannot be more than " + e), !0
        },
        numberValidation: function(e) {
            return ("number" != typeof e || e < 0) && i("Input is incorrect. Only number is supported and it should be greater than 0"), !0
        },
        objectValidation: function(e) {
            return null != e && "object" == typeof e || i("Input is incorrect. Only object is supported"), !0
        },
        objectSizeValidation: function(e) {
            return !(e.length > n)
        },
        queryStringValidation: function(e) {
            for (var n = 0; n < t.length; n++) - 1 != e.indexOf(t[n]) && i("Url query string cannot have redirects");
            return !0
        },
        customURLValidation: function(e) {
            return 1 == /^(?:[a-z]+:)?\/\//i.test(e) && i("Custom url cannot be absolute"), !0
        },
        throwError: i
    }
}(), (SNC = window.SNC || {}).Communication = function() {
    var e = {
            INIT: "openframe_init",
            SHOW: "openframe_show",
            HIDE: "openframe_hide",
            VISIBLE: "openframe_visible",
            REQUEST: "openframe_request",
            RESPONSE: "openframe_response",
            GET_CONFIG: "openframe_get_config",
            SET_SIZE: "openframe_set_size",
            SET_HEADER_TITLE: "openframe_set_header_title",
            SET_HEADER_TITLE_ICON: "openframe_set_header_title_icon",
            SET_HEADER_ICONS: "openframe_set_header_icons",
            SET_TOP_FRAME_URL: "openframe_set_top_frame_url",
            COMMUNICATION_FAILURE: "openframe_communication_failure"
        },
        n = "NOW.PostMessage",
        t = 3e3,
        i = {},
        o = "*",
        r = SNC.DataValidation;

    function a(t, i, a) {
        var s, E, c = "";
        r.contains(e, t) && (E = {
            type: n,
            eventName: t,
            args: i
        }, top.postMessage ? o || a ? (s = JSON.stringify(E), r.objectSizeValidation(s) || (c = "Message payload exceeds the supported limit")) : c = "The Top domain is undefined for cross domain messaging" : c = "Browser does not support cross domain messaging", c ? u(e.COMMUNICATION_FAILURE, c) : top.postMessage(s, o))
    }

    function s(e, n) {
        var t = i[e];
        t || (t = [], i[e] = t), t.push(n)
    }

    function u(e, n) {
        var t, o = i[e];
        if (o && 0 != o.length)
            for (t = 0; t < o.length; ++t) {
                o[t].call(null, n)
            }
    }
    return SNC.registeredPostMessageHandler || window.postMessage && (window.addEventListener("message", function(e) {
        var t;
        try {
            t = JSON.parse(e.data)
        } catch (e) {
            return
        }!t.type != n && u(t.eventName, t.args)
    }, !1), SNC.registeredPostMessageHandler = !0), {
        EVENTS: e,
        init: function(n, i) {
            ! function(n, i, r) {
                var a = !1;
                try {
                    n.request(e.INIT, {}, function(e) {
                        a || (a = !0, o = e.topDomain, i(e.result))
                    }, r, !0)
                } catch (e) {
                    a = !0, r(e)
                }
                setTimeout(function() {
                    a || (a = !0, r("Openframe init request timed out"))
                }, t)
            }(this, n, i)
        },
        contains: function(e, n) {
            for (var t in e)
                if (e.hasOwnProperty(t) && e[t] == n) return !0;
            return !1
        },
        publish: a,
        subscribe: s,
        request: function(n, t, o, u, E) {
            if (r.contains(e, n)) {
                var c = n + "_" + (new Date).getTime() * Math.random(),
                    l = {},
                    _ = this;
                l.id = c, l.method = n, l.payload = t, a(e.REQUEST, l, E), s(e.RESPONSE, function(e) {
                    var n, t, r;
                    c == e.context.id && (n = _.EVENTS.RESPONSE, t = arguments.callee, (r = i[n]) && 0 != r.length && -1 != r.indexOf(t) && r.splice(r.indexOf(t), 1), e.isSuccess ? o(e.context.result) : u(e.context.result))
                })
            }
        }
    }
}(), SNC.OpenFrame = function() {
    var e = "1.0.2",
        n = SNC.Communication,
        t = SNC.DataValidation;
    return {
        EVENTS: {
            HEADER_ICON_CLICKED: "openframe_header_icon_clicked",
            OPENFRAME_SHOWN: "openframe_shown",
            OPENFRAME_HIDDEN: "openframe_hidden",
            OPENFRAME_BEFORE_DESTROY: "openframe_before_destroy",
            COMMUNICATION_EVENT: "openframe_communication",
            COMMUNICATION_FAILURE: "openframe_communication_failure"
        },
        init: function(e, t, i) {
            n.init(function() {
                n.request(n.EVENTS.GET_CONFIG, e, t, i)
            }, i)
        },
        version: function() {
            return e
        },
        show: function() {
            n.publish(n.EVENTS.SHOW)
        },
        hide: function() {
            n.publish(n.EVENTS.HIDE)
        },
        isVisible: function(e, t) {
            n.request(n.EVENTS.VISIBLE, {}, e, t)
        },
        subscribe: function(e, i) {
            n.contains(this.EVENTS, e) ? n.subscribe(e, i) : t.throwError(e + " is not a valid event for subscription")
        },
        setTitle: function(e) {
            t.stringValidation(e, !0) && n.publish(n.EVENTS.SET_HEADER_TITLE, {
                title: e
            })
        },
        setSubtitle: function(e) {
            t.stringValidation(e, !0) && n.publish(n.EVENTS.SET_HEADER_TITLE, {
                subtitle: e
            })
        },
        setSize: function(e, i) {
            t.numberValidation(e) && t.numberValidation(i) && n.publish(n.EVENTS.SET_SIZE, {
                width: e,
                height: i
            })
        },
        setIcons: function(e) {
            t.objectValidation(e) && n.publish(n.EVENTS.SET_HEADER_ICONS, e)
        },
        setTitleIcon: function(e) {
            t.objectValidation(e) && n.publish(n.EVENTS.SET_HEADER_TITLE_ICON, e)
        },
        openServiceNowForm: function(e) {
            t.objectValidation(e) && e.query && t.queryStringValidation(e.query) && n.publish(n.EVENTS.SET_TOP_FRAME_URL, {
                form: e
            })
        },
        openServiceNowList: function(e) {
            t.objectValidation(e) && e.query && t.queryStringValidation(e.query) && n.publish(n.EVENTS.SET_TOP_FRAME_URL, {
                list: e
            })
        },
        openCustomURL: function(e) {
            var i = {
                url: e
            };
            t.stringValidation(i.url, !0, 2083) && t.customURLValidation(i.url) && n.publish(n.EVENTS.SET_TOP_FRAME_URL, {
                url: i
            })
        }
    }
}();
var openFrameAPI = SNC.OpenFrame;


var config = {
    title: "NOVELVOX CTI",
};

function handleCommunicationEvent(context) {
    console.log("Novelvox >>>> Communication from Topframe", context);
    if (context.type == "OUTGOING_CALL") {
        sendMsg("ServiceNowMakeCall", context.data.metaData.phoneNumber);
        openFrameAPI.isVisible(function callback(isVisible) {
            console.log(isVisible);
            if (!isVisible) {
                openFrameAPI.show();
            }
        });
        if (agentCurrentState == "NOT_READY") {
            openFrameAPI.setSubtitle('OUT: ' + context.data.metaData.phoneNumber);
        }

    }
}

function initSuccess(snConfig) {
    console.log("Novelvox >>>> openframe configuration", snConfig);
    //register for communication event from TopFrame
    openFrameAPI.subscribe(openFrameAPI.EVENTS.COMMUNICATION_EVENT,
        handleCommunicationEvent);
}

function initFailure(error) {
    console.log("Novelvox >>>> OpenFrame init failed..", error);
}
openFrameAPI.init(config, initSuccess, initFailure);


//**************************************************************************************************************//
var receiveMessage = function(event) {
    try {
        handleMessages(event);
    } catch (err) {
        console.error('receiveMessage', err.message);
    }
}

var addEvent = window.attachEvent || window.addEventListener;
var event = window.attachEvent ? 'onmessage' : 'message';
addEvent(event, receiveMessage);
var agentCurrentState = "";
var responseObj;
var Screenpopflow = "sys_user";
var datadialog = window.document.querySelector("iframe").contentWindow;
console.log("datadialog", datadialog);
var datadialogg = window.document.querySelector("iframe");

console.log("datadialogg", datadialogg);


var myIframe = document.getElementById("iagentFrame").src;
console.log("myIframe", myIframe);

			
var flowtype = myIframe.split('&')[1];
			console.log("flowtype", flowtype);
		
var valueparams = flowtype.split('=')[1];
			console.log("valueparams is", valueparams);
			
			
			var flowtypedata = document.getElementById("iagentFrame").getAttribute('flow_type');
console.log("flowtypedata", flowtypedata);


var Screenpopflow = valueparams;

var handleMessages = function(event) {
    console.log("Event recieved  in servicenow", JSON.stringify(event.data));



    if (event.data.eventName == "CallStartNotification") {
        console.log("Novelvox CallStartNotification Event Recived", event);

        openFrameAPI.setTitle('INBOUND CALL');
       

        openFrameAPI.isVisible(function callback(isVisible) {
            console.log('IS visible' + isVisible);
            if (!isVisible) {
                openFrameAPI.show();
            }
        });


        
        var ani = event.data.data.fromAddress;
        console.log("ANI is", ani);

        startCallTime = new Date();
        console.log(" start time ==> ", startCallTime);

      
		if(Screenpopflow == "sys_user"){
            var requestBody = "";
            var client = new XMLHttpRequest();
            
            client.open("get", "https://dev83436.service-now.com/api/now/table/sys_user?sysparm_query=GOTO123TEXTQUERY321%3D" + ani);
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');

            //Eg. UserName="admin", Password="admin" for this code sample.
            client.setRequestHeader('Authorization', 'Basic ' + btoa('admin' + ':' + 'A0sOTCyjsFy5'));
            
            client.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    responseObj = JSON.parse(this.responseText);
                    console.log('Response4: ', responseObj.result);


                    if (responseObj.result.length > 1) {
                        console.log('Inside MoreThan1 Condition');
                        for (var i = 0; i < responseObj.result.length; i++) {
                            responseObj.result[i].Name = responseObj.result[i].first_name + " " + responseObj.result[i].last_name;
                            var obj = new Object();
                            obj.type = "User";
                            responseObj.result[i].attributes = obj;
                        }
                    } else if (!responseObj.result[0]) {
                        console.log('Inside NoMatch Condition');
                        openFrameAPI.openServiceNowForm({
                            entity: "sys_user",
                            query: 'sys_id=-1&sysparm_query=phone=' + ani
                        });

                    } else if (responseObj.result.length = 1) {
                        console.log('Inside SingleMatch Condition');
                        var query = 'sys_id=' + responseObj.result[0].sys_id;

                        openFrameAPI.openServiceNowForm({
                            //entity: "incident",
                            entity: "sys_user",
                            query: query
                        });
                        sendMsg("UPDATE_NAME", responseObj.result[0].first_name + " " + responseObj.result[0].last_name);
                    } else {
                        console.log('Inside ELSE Condition');
                        openFrameAPI.openServiceNowForm({
                            //entity: "incident",
                            entity: "sys_user",
                            //query: 'sys_id=-1'
                            query: 'sys_id=-1'
                        });
                    }

                } else {
                    console.log('Response4 ELSE');
                }
            };
            client.send(requestBody);

        } else if(Screenpopflow == "incident"){
            var requestBody = "";
            //popentitiy = "incident";

            var client = new XMLHttpRequest();
            client.open("get", "https://dev83436.service-now.com/api/now/table/incident?sysparm_query=number%3D" + ani);
            
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');

            //Eg. UserName="admin", Password="admin" for this code sample.
            client.setRequestHeader('Authorization', 'Basic ' + btoa('admin' + ':' + 'A0sOTCyjsFy5'));
           
            client.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    responseObj = JSON.parse(this.responseText);
                    console.log('Response4: ', responseObj.result);


                    if (responseObj.result.length > 1) {
                        console.log('Inside MoreThan1 Condition');
                        for (var i = 0; i < responseObj.result.length; i++) {
                            responseObj.result[i].Name = responseObj.result[i].short_description;
                           
                            var obj = new Object();
                            //obj.type = "Incident";
                            obj.type = "User";
                            responseObj.result[i].attributes = obj;
                        }
                        //sendMsg("SCREENPOP_MULTIPLE_RECORD_DATA", responseObj.result);
                    } else if (!responseObj.result[0]) {
                        console.log('Inside NoMatch Condition');
                        openFrameAPI.openServiceNowForm({
                            entity: "incident",
                            query: 'sys_id=-1&sysparm_query=Caller_Phone=3333'
                            
                        });

                    } else if (responseObj.result.length = 1) {
                        console.log('Inside SingleMatch Condition');
                        var query = 'sys_id=' + responseObj.result[0].sys_id;

                        openFrameAPI.openServiceNowForm({
                            entity: "incident",
                            //entity: "sys_user",
                            query: query
                        });
                        sendMsg("UPDATE_NAME", responseObj.result[i].short_description);
                        
                    } else {
                        console.log('Inside ELSE Condition');
                        openFrameAPI.openServiceNowForm({
                            entity: "incident",
                            //entity: "sys_user",
                            //query: 'sys_id=-1'
                            query: 'sys_id=-1'
                        });
                    }

                } else {
                    console.log('Response4 ELSE');
                }
            };
            client.send(requestBody);

           

        } else if(Screenpopflow == "interaction"){ 
            var requestBody = "";
           // popentitiy = "interaction";
            var client = new XMLHttpRequest();
            client.open("get", "https://dev83436.service-now.com/api/now/table/interaction?sysparm_query=number%3D" + ani);
          
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');

            //Eg. UserName="admin", Password="admin" for this code sample.
            client.setRequestHeader('Authorization', 'Basic ' + btoa('admin' + ':' + 'A0sOTCyjsFy5'));
           
            client.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    responseObj = JSON.parse(this.responseText);
                    console.log('Response4: ', responseObj.result);


                    if (responseObj.result.length > 1) {
                        console.log('Inside MoreThan1 Condition');
                        for (var i = 0; i < responseObj.result.length; i++) {
                            responseObj.result[i].Name = responseObj.result[i].short_description;
                            //responseObj.result[i].Name = responseObj.result[i].first_name + " " + responseObj.result[i].last_name;
                            var obj = new Object();
                            //obj.type = "Incident";
                            obj.type = "interaction";
                            responseObj.result[i].attributes = obj;
                        }
                       
                    } else if (!responseObj.result[0]) {
                        console.log('Inside NoMatch Condition');
                        openFrameAPI.openServiceNowForm({
                            entity: "interaction",
                            query: 'sys_id=-1&sysparm_query=Caller_Phone=3333'
                           
                        });

                    } else if (responseObj.result.length = 1) {
                        console.log('Inside SingleMatch Condition');
                        var query = 'sys_id=' + responseObj.result[0].sys_id;

                        openFrameAPI.openServiceNowForm({
                            entity: "interaction",
                            //entity: "sys_user",
                            query: query
                        });
                        sendMsg("UPDATE_NAME", responseObj.result[i].short_description);
                       
                    } else {
                        console.log('Inside ELSE Condition');
                        openFrameAPI.openServiceNowForm({
                            entity: "interaction",
                            //entity: "sys_user",
                            //query: 'sys_id=-1'
                            query: 'sys_id=-1'
                        });
                    }

                } else {
                    console.log('Response4 ELSE');
                }
            };
            client.send(requestBody);

           

        } 

    } else if (event.data.eventName == "CallAnswerEvent") {
        console.log("Event recieved  from plugin", JSON.stringify(event.data));
        if (responseObj.result.length > 1) {
            sendMsg("SCREENPOP_MULTIPLE_RECORD_DATA", responseObj.result);
        }
    } else if (event.data.eventName == "CallEndNotification") {
        console.log("Novelvox CallEndNotification Event Recived", event);

        openFrameAPI.setTitle('NOVELVOX CTI');

        openFrameAPI.isVisible(function callback(isVisible) {

            if (isVisible) {
                openFrameAPI.hide();
            }
        });
        openFrameAPI.setTitle('');
        openFrameAPI.setSubtitle("");

        var ani = event.data.data.fromAddress;
        console.log("ANI is", ani);

        var EndCallTime = new Date();
        console.log(" End time ==> ", EndCallTime);


        var Duration = EndCallTime - startCallTime;
        var seconds = Duration / 1000;
        var minutes = seconds / 60;
        var seconds = (Math.round(seconds % 60)).toFixed(2);
        var hours = minutes / 60;
        var minutes = minutes % 60;
        var dataa = Math.floor(minutes) + ":" + Math.floor(seconds);
        console.log("duration", dataa);
       




    } else if (event.data.eventName == "AgentStateNotification") {
        console.log("Novelvox AgentStateNotification Event Recived", event);
        //console.log("Event for NAD Make Call",event);
        agentCurrentState = event.data.value.status;

        var version = openFrameAPI.version();
        console.log("API version " + version);

    } else if (event.data.eventName == "doubleClickedEvent") {
        console.log("doubleClickedEvent Event Recived", event.data);

    } else if (event.data.eventName == "ScreenPopSelectedData") {
        console.log("ScreenPopSelectedData Event Recived", event.data);
        var query = 'sys_id=' + event.data.value.sys_id;
        openFrameAPI.openServiceNowForm({
            //entity: "incident",
            entity: Screenpopflow,
            query: query
        });

        sendMsg("UPDATE_NAME", event.data.value.Name);

    } else if (event.data.eventName == "MultipleRecordData") {
        console.log("MultipleRecordData Event Recived", event.data);

    }

};
var sendMsg = function(eventType, data) {
    try {
        var obj = new Object();
        obj['eventName'] = eventType;
        obj['value'] = data;
        var win = document.getElementById("iagentFrame").contentWindow;
        win.postMessage(obj, '*');
    } catch (err) {
        console.log("FinesseGadgetUtil Error Posting Message :" +
            err.message);
    }
};


function getCallTime(startCallTime, endCallTime) {
    startCallTime = endCallTime - startCallTime;
    var seconds = startCallTime / 1000;
    var minutes = seconds / 60;
    var seconds = seconds % 60;
    var hours = minutes / 60;
    var minutes = minutes % 60;
    var data = Math.floor(hours) + ":" + Math.floor(minutes) + ":" + Math.floor(seconds);
    return data;
}
