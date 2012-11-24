(function (ns) {
    "use strict";
    ns.persistentStorage = localStorage;
}(this.$t = this.$t || {}));

(function (ns) {
    "use strict";
    var _this = ns
    	,_class2type = {};

    ns.select = ns.core.select = function(query){
        return document.querySelector(query);
    },

    ns.selectAll = ns.core.selectAll = function(query){
        return document.querySelectorAll(query);
    },

    ns.isFunction = ns.core.isFunction = function (obj) {
        return _this.type(obj) === "function";
    },

    ns.isArray = ns.core.isArray = Array.isArray || function (obj) {
        return _this.type(obj) === "array";
    },

    ns.isWindow = ns.core.isWindow = function (obj) {
        return obj != null && obj == obj.window;
    },

    ns.isNumeric = ns.core.isNumeric = function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    ns.type = ns.core.type = function (obj) {
        return obj == null ?
            String(obj) :
            _class2type[ Object.prototype.toString.call(obj) ] || "object";
    },

    ns.isPlainObject = ns.core.isPlainObject = function (obj) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || _this.type(obj) !== "object" || obj.nodeType || _this.isWindow(obj)) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
                !Object.prototype.hasOwnProperty.call(obj, "constructor") &&
                !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for (key in obj) {
        }

        return key === undefined || Object.prototype.hasOwnProperty.call(obj, key);
    };

    ns.isEmptyObject = ns.core.isEmptyObject = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };
    ns.each = ns.core.each = function (obj, callback, args) {
        var name,
            i = 0,
            length = obj.length,
            isObj = length === undefined || _this.isFunction(obj);

        if (args) {
            if (isObj) {
                for (name in obj) {
                    if (callback.apply(obj[ name ], args) === false) {
                        break;
                    }
                }
            } else {
                for (; i < length;) {
                    if (callback.apply(obj[ i++ ], args) === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        } else {
            if (isObj) {
                for (name in obj) {
                    if (callback.call(obj[ name ], name, obj[ name ]) === false) {
                        break;
                    }
                }
            } else {
                for (; i < length;) {
                    if (callback.call(obj[ i ], i, obj[ i++ ]) === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    ns.extend = ns.core.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !_this.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[ i ]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( _this.isPlainObject(copy) || (copyIsArray = _this.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && _this.isArray(src) ? src : [];

                        } else {
                            clone = src && _this.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = _this.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };
    ns.merge = ns.core.merge = function (first, second) {
        var l = second.length,
            i = first.length,
            j = 0;

        if (typeof l === "number") {
            for (; j < l; j++) {
                first[ i++ ] = second[ j ];
            }

        } else {
            while (second[j] !== undefined) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    };

    ns.proxy = ns.core.proxy = function (fn, context) {
        var tmp, args, proxy;

        if (typeof context === "string") {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if (!_this.isFunction(fn)) {
            return undefined;
        }

        // Simulated bind
        args = Array.prototype.slice.call(arguments, 2);
        proxy = function () {
            return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || proxy.guid || _this.guid++;

        return proxy;
    };

    ns.trim = ns.core.trim = String.prototype.trim && !String.prototype.trim.call("\uFEFF\xA0") ?
        function (text) {
            return text == null ?
                "" :
                String.prototype.trim.call(text);
        } :

        // Otherwise use our own trimming functionality
        function (text) {
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            return text == null ?
                "" :
                text.toString().replace(rtrim, "");
        };
        
    ns.parseJSON = ns.core.parseJSON = function(data) {
		var rvalidchars = /^[\],:{}\s]*$/
			,rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g
			,rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g
			,rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;

		if (!data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = _this.trim(data);

		// Attempt to parse using the native JSON parser first
		if (window.JSON && window.JSON.parse) {
			return window.JSON.parse(data);
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if (rvalidchars.test(data.replace(rvalidescape, "@").replace(
				rvalidtokens, "]").replace(rvalidbraces, ""))) {

			return (new Function("return " + data))();

		}
		// invalid JSON
		console.error("Invalid JSON format.");
	};
	// Cross-browser xml parsing
	ns.parseXML = ns.core.parseXML = function(data) {
		var xml, tmp;
		if (!data || typeof data !== "string") {
			return null;
		}
		try {
			if (window.DOMParser) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString(data, "text/xml");
			} else { // IE
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(data);
			}
		} catch (e) {
			xml = undefined;
		}
		if (!xml || !xml.documentElement
				|| xml.getElementsByTagName("parsererror").length) {
			// invalid XML
			console.error("Invalid XML format.");
		}
		return xml;
	};
        
    // INITIALIZE
    ns.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
            _class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });
    
    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser:match[ 1 ] || "",
            version:match[ 2 ] || "0"
        };
    };
    
        
    var matched = uaMatch(navigator.userAgent);

    if (matched.browser) {
        ns.browser[ matched.browser ] = true;
        ns.browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (ns.browser.chrome) {
    	ns.browser.webkit = true;
    } else if (ns.browser.webkit) {
    	ns.browser.safari = true;
    }
}(this.$t.util = this.$t.util || 
{
    guid:1,
    browser:{},
    core:{}
}
));

if (this.$t.util)
    (function ($) {
        var _this = $;
        // Add function to Util namespace
        $.extend({
            dataToXml:function (data) {
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<inputParameters>" + _this.objectToXml(data) + "</inputParameters>";
            },

            objectToXml:function (data) {
                var encodedData = "",
                    key;
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        var value = data[key];
                        if (typeof value !== 'string') {
                            value = _this.objectToXml(value);
                        }
                        encodedData += "<" + key + ">" + value + "</" + key + ">";
                    }
                }
                return encodedData;
            },

            getAttribute:function (element, attrName) {
                if (attrName === "@") {
                    return element.innerHTML;
                } else {
                    return element[attrName] || element.getAttribute(attrName);
                }
            },

            setAttribute:function (element, attrName, value) {
                if (attrName === "@") {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(attrName, value);
                }
            },

            cloneObject:function cloneObject(src) {
                var newObj = (src instanceof Array) ? [] : {};
                for (var i in src) {
                    if (src[i] && typeof src[i] == "object") {
                        newObj[i] = cloneObject(src[i]);
                    } else {
                        newObj[i] = src[i];
                    }
                }
                return newObj;
            },

            simplifyPath:function (path) {
                var resultPath = new Array(),
                    resultIndex = 0;
                for (var i = 0; i < path.length; i++) {
                    var pathPart = path[i],
                        openBracketIndex = pathPart.lastIndexOf("["),
                        closeBracketIndex = pathPart.lastIndexOf("]");
                    if (openBracketIndex != -1 && closeBracketIndex != -1) {
                        resultPath[resultIndex] = pathPart.substring(0, openBracketIndex);
                        ++resultIndex;
                        resultPath[resultIndex] = pathPart.substring(openBracketIndex + 1, closeBracketIndex);
                        ++resultIndex;
                    } else {
                        resultPath[resultIndex] = pathPart;
                        ++resultIndex;
                    }
                }

                return resultPath;
            },

            setDataValueByPath:function (container, path, value) {
                var destinationObject = $.getDestinationObject($.simplifyPath(path), container);
                destinationObject[path[path.length - 1]] = value;
            },

            getDestinationObject:function getDestinationObject(path, container) {
                if (path.length == 1) {
                    return container;
                } else {
                    var pathPart = path[0];
                    path.shift();
                    container[pathPart] = {};
                    return getDestinationObject(path, container[pathPart]);
                }
            }
        });

    })(this.$t.util);
/*
 ### jQuery XML to JSON Plugin v1.1 - 2008-07-01 ###
 * http://www.fyneworks.com/ - diego@fyneworks.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
 Website: http://www.fyneworks.com/jquery/xml-to-json/
 *//*
 # INSPIRED BY: http://www.terracoder.com/
 AND: http://www.thomasfrank.se/xml_to_json.html
 AND: http://www.kawa.net/works/js/xml/objtree-e.html
 *//*
 This simple script converts XML (document of code) into a JSON object. It is the combination of 2
 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
 */
// Avoid collisions

;
if (this.$t.util) (function ($) {
	var _this = $;

    // Add function to Util namespace
    $.extend({

        // converts xml documents and xml text to json object
        xml2json:function (xml, extended) {
            if (!xml) return {}; // quick fail

            //### PARSER LIBRARY
            // Core function
            function parseXML(node, simple) {
                if (!node) return null;
                var txt = '', obj = null, att = null;
                var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
                var nv = node.text || node.nodeValue || '';
                /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
                if (node.childNodes) {
                    if (node.childNodes.length > 0) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
                        _this.each(node.childNodes, function (n, cn) {
                            var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
                            var cnv = cn.text || cn.nodeValue || '';
                            /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
                            if (cnt == 8) {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
                                return; // ignore comment node
                            }
                            else if (cnt == 3 || cnt == 4 || !cnn) {
                                // ignore white-space in between tags
                                if (cnv.match(/^\s+$/)) {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
                                    return;
                                }
                                ;
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
                                txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                                // make sure we ditch trailing spaces from markup
                            }
                            else {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
                                obj = obj || {};
                                if (obj[cnn]) {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

                                    // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                    if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
                                    obj[cnn] = myArr(obj[cnn]);

                                    obj[cnn][ obj[cnn].length ] = parseXML(cn, true/* simple */);
                                    obj[cnn].length = obj[cnn].length;
                                }
                                else {
                                    /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
                                    obj[cnn] = parseXML(cn);
                                }
                                ;
                            }
                            ;
                        });
                    }
                    ;//node.childNodes.length>0
                }
                ;//node.childNodes
                if (node.attributes) {
                    if (node.attributes.length > 0) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
                        att = {};
                        obj = obj || {};
                        _this.each(node.attributes, function (a, at) {
                            var atn = jsVar(at.name), atv = at.value;
                            att[atn] = atv;
                            if (obj[atn]) {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

                                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                                //if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
                                obj[cnn] = myArr(obj[cnn]);

                                obj[atn][ obj[atn].length ] = atv;
                                obj[atn].length = obj[atn].length;
                            }
                            else {
                                /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                                obj[atn] = atv;
                            }
                            ;
                        });
                        //obj['attributes'] = att;
                    }
                    ;//node.attributes.length>0
                }
                ;//node.attributes
                if (obj) {
                    obj = _this.extend((txt != '' ? new String(txt) : {}), /* {text:txt},*/ obj || {}/*, att || {}*/);
                    txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
                    if (txt) obj.text = txt;
                    txt = '';
                }
                ;
                var out = obj || txt;
                //console.log([extended, simple, out]);
                if (extended) {
                    if (txt) out = {};//new String(out);
                    txt = out.text || txt || '';
                    if (txt) out.text = txt;
                    if (!simple) out = myArr(out);
                }
                ;
                return out;
            }

            ;// parseXML
            // Core Function End
            // Utility functions
            var jsVar = function (s) {
                return String(s || '').replace(/-/g, "_");
            };

            // NEW isNum function: 01/09/2010
            // Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
            function isNum(s) {
                // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
                // few bugs corrected from original function :
                // - syntax error : regexp.test(string) instead of string.test(reg)
                // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
                // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
                // - string is "trimmed", allowing to accept space at the beginning and end of string
                var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
                return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? _this.trim(s) : ''));
            }

            ;
            // OLD isNum function: (for reference only)
            //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

            var myArr = function (o) {

                // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                //if(!o.length) o = [ o ]; o.length=o.length;
                if (!_this.isArray(o)) o = [ o ];
                o.length = o.length;

                // here is where you can attach additional functionality, such as searching and sorting...
                return o;
            };
            // Utility functions End
            //### PARSER LIBRARY END

            // Convert plain text to xml
            if (typeof xml == 'string') xml = _this.text2xml(xml);

            // Quick fail if not xml (or if this is a node)
            if (!xml.nodeType) return;
            if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

            // Find xml root node
            var root = (xml.nodeType == 9) ? xml.documentElement : xml;

            // Convert xml to json
            var out = parseXML(root, true /* simple */);

            // Clean-up memory
            xml = null;
            root = null;

            // Send output
            return out;
        },

        // Convert text to XML DOM
        text2xml:function (str) {
            // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
            //return $(xml)[0];
            var out;
            try {
                var xml = (_this.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
                xml.async = false;
            } catch (e) {
                throw new Error("XML Parser could not be instantiated")
            }
            ;
            try {
                if (_this.browser.msie) out = (xml.loadXML(str)) ? xml : false;
                else out = xml.parseFromString(str, "text/xml");
            } catch (e) {
                throw new Error("Error parsing XML string")
            }
            ;
            return out;
        }

    }); // extend $

})(this.$t.util);
if (this.$t.util)
	(function($) {
		var _this = $
			,rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/
			,rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
			,ajaxLocParts
			,ajaxLocation;
		// IE may throw an exception when accessing
		// a field from window.location if document.domain has been set
		try {
			ajaxLocation = location.href;
		} catch (e) {
			// Use the href attribute of an A element
			// since IE will modify it given document.location
			ajaxLocation = document.createElement("a");
			ajaxLocation.href = "";
			ajaxLocation = ajaxLocation.href;
		}

		// Segment location into parts
		ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

		// Add function to Util namespace
		$.extend({
					//Serialize an array of form elements or a set of key/values into a query string
					param : function(a, traditional) {
						var prefix
							,s = []
							,r20 = /%20/g
							,add = function(key,value) {
								// If value is a function, invoke it and return its value
								value = _this.isFunction(value) ? value()
									: (value == null ? "" : value);
								s[s.length] = encodeURIComponent(key) + "="
									+ encodeURIComponent(value);
							} 
						,buildParams = function(prefix, obj, traditional, add) {
							var name;

							if (_this.isArray(obj)) {
								// Serialize array item.
								_this.each(obj, function(i, v) {
									if (traditional || rbracket.test(prefix)) {
										// Treat each array item as a scalar.
										add(prefix, v);

									} else {
										// If array item is non-scalar (array or object), encode its
										// numeric index to resolve deserialization ambiguity issues.
										// Note that rack (as of 1.0.0) can't currently deserialize
										// nested arrays properly, and attempting to do so may cause
										// a server error. Possible fixes are to modify rack's
										// deserialization algorithm or to provide an option or flag
										// to force array serialization to be shallow.
										buildParams(prefix
												+ "["
												+ (typeof v === "object" ? i
														: "") + "]", v,
												traditional, add);
									}
								});

							} else if (!traditional
									&& _this.type(obj) === "object") {
								// Serialize object item.
								for (name in obj) {
									buildParams(prefix + "[" + name + "]",
											obj[name], traditional, add);
								}

							} else {
								// Serialize scalar item.
								add(prefix, obj);
							}
						};

						// If an array was passed in, assume that it is an array of form elements.
						if (_this.isArray(a) || (!_this.isPlainObject(a))) {
							// Serialize the form elements
							_this.each(a, function() {
								add(this.name, this.value);
							});

						} else {
							// If traditional, encode the "old" way (the way 1.3.2 or older
							// did it), otherwise encode params recursively.
							if (traditional === undefined) {
								traditional = _this.ajaxSettings
										&& _this.ajaxSettings.traditional;
							}

							for (prefix in a) {
								buildParams(prefix, a[prefix], traditional, add);
							}
						}

						// Return the resulting serialization
						return s.join("&").replace(r20, "+");
					},
					ajaxSettings : {
						url : ajaxLocation,
						isLocal : rlocalProtocol.test(ajaxLocParts[1]),
						global : true,
						type : "GET",
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						processData : true,
						async : true,

						accepts : {
							xml : "application/xml, text/xml",
							html : "text/html",
							text : "text/plain",
							json : "application/json, text/javascript",
							"*" : [ "*/" ] + [ "*" ]
						},

						contents : {
							xml : /xml/,
							html : /html/,
							json : /json/
						},

						responseFields : {
							xml : "responseXML",
							text : "responseText"
						},

						// List of data converters
						// 1) key format is "source_type destination_type" (a single space in-between)
						// 2) the catchall symbol "*" can be used for source_type
						converters : {

							// Convert anything to text
							"* text" : window.String,

							// Text to html (true = no transformation)
							"text html" : true,

							// Evaluate text as a json expression
							"text json" : _this.parseJSON,

							// Parse text as xml
							"text xml" : _this.parseXML
						},

						// For options that shouldn't be deep extended:
						// you can add your own custom options here if
						// and when you create one that shouldn't be
						// deep extended (see ajaxExtend)
						flatOptions : {
							context : true,
							url : true
						}
					}
				}); // extend $

	})(this.$t.util);
(function (ns) {
    "use strict";

    var mappingRendererTypes = [];

    ns.addMappingRendererType = function (mappingRendererType) {
        mappingRendererTypes.push(mappingRendererType);
    };

    ns.render = function (mappings, data) {
        for (var i = 0, mappingsCount = mappings.length; i < mappingsCount; i++) {
            var mapping = mappings[i],
                renderer = undefined;
            for (var rendererIndex = 0; rendererIndex < mappingRendererTypes.length; rendererIndex++) {
                var rendererType = mappingRendererTypes[rendererIndex];
                if (rendererType.prototype.isSuitable(mapping)) {
                    renderer = new rendererType(ns.util.cloneObject(mapping), data);
                    break;
                }
            }

            if (!renderer) {
                renderer = new ns.DefaultMappingRenderer(ns.util.cloneObject(mapping), data);
            }

            renderer.render();
        }
    };

    ns.DefaultMappingRenderer = function (mapping, data) {
        this.mapping = mapping;
        this.data = data;
    };

    ns.DefaultMappingRenderer.prototype.isSuitable = function (mapping) {
        return true;
    };

    ns.DefaultMappingRenderer.prototype.getValueFromPath = function getValueFromPath(path, data) {
        if (path.length == 1) {
            return data[path[0]];
        } else {
            var containerObject = data[path[0]];
            if (containerObject) {
                path.shift();
                return getValueFromPath(path, containerObject);
            } else {
                return undefined;
            }
        }
    };

    ns.DefaultMappingRenderer.prototype.cloneTemplate = function (src) {
        if (src) {
            var node = src.cloneNode(true);
            node.style.display = "block";
            return node;
        }
    };

    ns.DefaultMappingRenderer.prototype.getAllChildren = function getAllChildren(node,result) {
        if(node) {
            var childNodes = node.childNodes;

            if (childNodes) {
                for (var nodeIndex = 0; nodeIndex < childNodes.length; nodeIndex++) {
                    result = result.concat(childNodes[nodeIndex]);
                }
                for (var i = 0; i < childNodes.length; i++) {
                    result = getAllChildren(childNodes[i], result);
                }
            }
            return result;
        } else {
            return result;
        }
    };

    ns.DefaultMappingRenderer.prototype.handleMappingRuleForClonedTemplate = function (rule, template, dataItem) {
        if (rule && template && dataItem) {
            var clonedChildNodes = this.getAllChildren(template, []);
            for(var clonedChildIndex=0; clonedChildIndex < clonedChildNodes.length; clonedChildIndex++) {
                var clonedChild = clonedChildNodes[clonedChildIndex];
                if(clonedChild.getAttribute && clonedChild.getAttribute("dsid")===rule.ID) {
                    var valueFromPath = this.getValueFromPath(rule.PATH,dataItem);
                    if(rule.TRANSFORMATION) {
                        valueFromPath = rule.TRANSFORMATION(valueFromPath,clonedChild);
                    }
                    ns.util.setAttribute(clonedChild, rule.ATTR, valueFromPath);
                }
            }
        }
    };

    ns.DefaultMappingRenderer.prototype.clearContainer = function (container, template) {
        if (container && template) {
            container.innerHTML = "";
            container.appendChild(template);

        }
    };

    ns.DefaultMappingRenderer.prototype.render = function () {
        var isForLocalStorage = this.mapping.ID === "___local_storage___",
            transformationFunction = this.mapping.TRANSFORMATION,
            attribute = this.mapping.ATTR,
            value = this.getValueFromPath(ns.util.simplifyPath(this.mapping.PATH), this.data),
            element = isForLocalStorage ? undefined : ns.util.select("#" + this.mapping.ID);

        if (this.mapping.SET) {
            var template = ns.util.select("#" + this.mapping.ID + " [ds-role='template']");
            if (element && template && element.childNodes) {
                this.clearContainer(element,template);

                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        var currentDataItem = value[key];
                        var clonedTemplate = this.cloneTemplate(template);

                        for (var mappingKey in this.mapping.SET) {
                            if (this.mapping.SET.hasOwnProperty(mappingKey)) {
                                this.handleMappingRuleForClonedTemplate(this.mapping.SET[mappingKey], clonedTemplate, currentDataItem);
                            }
                        }
                        element.appendChild(clonedTemplate);
                    }
                }
            }
        } else {
            if (transformationFunction) {
                value = transformationFunction(value, element);
            }

            if (isForLocalStorage) {
                ns.persistentStorage.setItem(attribute, value);
            } else {
                ns.util.setAttribute(element, attribute, value);
            }
        }

    };

}(this.$t = this.$t || {}));
/**
 * Request data builder
 */
(function (ns) {
    "use strict";
    var mappingProcessors = [];

    ns.addMappingProcessor = function (processor) {
        mappingProcessors.push(processor);
    };

    ns.buildRequestConfiguration = function (mappings) {
        var resultHeaders = {},
            resultParameters = {};

        for (var i = 0, mappingsCount = mappings.length; i < mappingsCount; i++) {
            var parameters = undefined,
                headers = undefined,
                processor = undefined;

                var mapping = mappings[i];

                for (var k = 0; k < mappingProcessors.length; k++) {
                    var processorType = mappingProcessors[k];
                    if (processorType.prototype.isSuitable(mapping)) {
                        processor = new processorType(mapping);
                    }
                }

                //Suitable processor type not found so we will use the default one
                if (processor == undefined) {
                    processor = new ns.DefaultMappingProcessor(mapping);
                }

                processor.process();
                parameters = processor.getParameters();
                headers = processor.getHeaders();
                resultParameters = ns.util.extend(resultParameters, parameters);
                resultHeaders = ns.util.extend(resultHeaders, headers);

        }
        return {parameters : resultParameters, headers : resultHeaders};
    };

    /**
     * Default mapping processor. In case you need extra functionality for some mapping or element all you need is to
     * implement class like this or extend this class
     *
     * @param mapping object that represents one out-mapping
     * @constructor
     */
    ns.DefaultMappingProcessor = function (mapping) {
        var parameters = {};
        var headers = {};

        this.getMapping = function () {
            return mapping;
        };

        this.getHeaders = function () {
            return headers;
        };

        this.getParameters = function () {
            return parameters;
        }
    };

    /**
     * Checks the suitability of mapping processor and given mapping
     *
     * @param mapping
     * @return {Boolean} true if processor is suitable
     */
    ns.DefaultMappingProcessor.prototype.isSuitable = function (mapping) {
        return true;
    };

    ns.DefaultMappingProcessor.prototype.process = function () {
        var mapping = this.getMapping(),
            headers = this.getHeaders(),
            parameters = this.getParameters();

        if (mapping.SET) {

        } else {
            var isHeader = !!mapping.HEADER,
                predefinedValue = !mapping.ID,
                isFromLocalStorage = mapping.ID === "___local_storage___",
                transformationFunction = mapping.TRANSFORMATION,
                attribute = mapping.ATTR,
                value;

            if (predefinedValue) {
                value = attribute;
            } else {
                if (isFromLocalStorage) {
                    value = ns.persistentStorage.getItem(attribute);
                } else {
                    value = ns.util.getAttribute(ns.util.select("#" + mapping.ID), attribute);
                }
            }

            if (transformationFunction) {
                value = transformationFunction(value);
            }
            if(value) {
                ns.util.setDataValueByPath(isHeader ? headers : parameters, mapping["PATH"], value);
            }
        }
    }

}(this.$t = this.$t || {}));
/**
 * DataSource
 */
(function (ns) {
    "use strict";
    ns.DataSource = function (service, options) {
        this.service = service;
        this.options = options;
        this.responseMapping = options.responseMapping || [];
        this.requestMapping = options.requestMapping || [];
        this.requestOptions = ns.util.extend({}, this.requestDefaults, options);
    };

    var proto = ns.DataSource.prototype;

    proto.execute = function (settings) {
        this.service.process(this.buildRequestSettings(settings));
    };

    proto.updateComponents = function (data) {
        ns.render(this.responseMapping, data);
    };

    proto.onBeforeSend = function () {

    };

    proto.onSuccess = function (data) {
        if (this.service.requestOptions.dataType === "xml") {
            this.updateComponents(ns.util.xml2json(data));
        } else {
            this.updateComponents(data);
        }

        if (this.options.onSuccess) {
            this.options.onSuccess.apply(this, ns.util.merge([], arguments));
        }
    };

    proto.onComplete = function () {
        if (this.options.onComplete) {
            this.options.onComplete.apply(this, ns.util.merge([], arguments));
        }
    };

    proto.onError = function () {

        if (this.options.onError) {
            this.options.onError.apply(this, ns.util.merge([], arguments));
        }
    };

    proto.handleData = function () {
        var args = $t.util.merge([], arguments);
        var data = args[0];

        if (ns.util.type(data) === 'string') {
            data = $t.util.parseJSON(data);
            args[0] = data;
        }

        this.onSuccess.apply(this, args);
    };

    proto.buildRequestSettings = function (settings) {

        var proxy = ns.util.proxy,
            handlers = {
                'success': proxy(this.handleData, this),
                'error': proxy(this.onError, this),
                'complete': proxy(this.onComplete, this),
                'beforeSend': proxy(this.onBeforeSend, this)
            };
        settings = ns.util.extend(handlers, this.service.requestOptions, settings || {});

        var requestConfiguration = ns.buildRequestConfiguration(this.requestMapping);

        settings.data = requestConfiguration.parameters;
        settings.headers = requestConfiguration.headers;

        return settings;
    };

}(this.$t = this.$t || {}));

(function (namespace) {
    "use strict";

    namespace.RestService = function (requestSettings, Request) {
        this.requestOptions = namespace.util.extend({}, this.requestDefaults, requestSettings);
        this.Request = Request;
    };

    var proto = namespace.RestService.prototype;

    proto.requestDefaults = {
        dataType: "json",
        type: "get",
        cache: true,
        crossDomain: true,
        timeout: 20000,
        traditional: true
    };

    proto.process = function (settings) {
        var request = new this.Request(settings);
        request.send();
    };

} (this.$t = this.$t || {}));

/**
 * Implementation of Request for Windows 8.
 */
(function (namespace) {
    "use strict";

    namespace.Request = WinJS.Class.define(
        function (options) {
            this.options = options;
        },

        {
            send: function () {
                var _options = this.options;
                if (_options.type && _options.type === 'get') {
                    if (_options.url.indexOf("?") == -1) {
                        _options.url += "?";
                    } else if (!(_options.url.indexOf("?") + 1 == _options.url.length)) {
                        _options.url += "&";
                    }
                    _options.url += $t.util.param(_options.data);
                } else if (_options.type && _options.type !== 'get') {
		    if (_options.dataType && _options.dataType.indexOf('xml') !== -1) {
                        _options.data = namespace.util.dataToXml(_options.data);
                    } else if (_options.dataType && _options.dataType.indexOf('json') !== -1 && JSON && (typeof JSON.stringify === 'function')) {
                        _options.data = JSON.stringify(_options.data);
                    }
                }

                WinJS.xhr(_options).then (
                    function (data) {
                        //var response = (options.dataType.indexOf('json') !== -1) ? JSON.parse(data.responseText) : data.responseXML;
                        var response = (_options.dataType.indexOf('json') !== -1) ? data.responseText : data.responseXML;
                        _options.success(response);
                    },
                    function (data) {
                        _options.error(data);
                    }
                );
            }
        }
    );

} (this.$t = this.$t || {}));

/**
 * Win8-specific renderers
 */
(function (ns) {
    "use strict";
    /**
     * ListViewRenderer
     *
     * @param mapping
     * @param data
     * @constructor
     */
    ns.ListViewRenderer = function (mapping, data) {
        ns.DefaultMappingRenderer.call(this, mapping, data);
    };
    //noinspection JSCheckFunctionSignatures
    ns.ListViewRenderer.prototype = new ns.DefaultMappingRenderer();
    ns.ListViewRenderer.prototype.constructor = new ns.ListViewRenderer();
    ns.ListViewRenderer.prototype.isSuitable = function (mapping) {
        var component = ns.util.select("#" + mapping.ID);
        return mapping.ID !== "___local_storage___" && component && component.getAttribute("data-win-control") === "WinJS.UI.ListView";
    };

    ns.ListViewRenderer.prototype.render = function () {
        var mapping = this.mapping,

            array = this.getValueFromPath(mapping.PATH, this.data),
            component = ns.util.select("#" + this.mapping.ID).winControl,

            list;

        if (this.mapping.SET) {
            for (var mappingKey in this.mapping.SET) {
                if (this.mapping.SET.hasOwnProperty(mappingKey)) {
                    var subMapping = this.mapping.SET[mappingKey];
                    var TRANSFORMATION = subMapping.TRANSFORMATION;
                    if(TRANSFORMATION) {
                        for(var i=0; i < array.length; i++) {
                            var itemFromArray = array[i];
                            var valueFromItem = this.getValueFromPath(subMapping.PATH, itemFromArray);
                            valueFromItem = TRANSFORMATION(valueFromItem);
                            ns.util.setDataValueByPath(itemFromArray,subMapping.PATH,valueFromItem);
                        }
                    }
                }
            }
        }

        list = new WinJS.Binding.List(array);

        if (mapping.FUNCTION_COMPARE_GROUPS && mapping.FUNCTION_GET_GROUP_DATA && mapping.FUNCTION_GET_GROUP_KEY) {

            list = list.createGrouped(mapping.FUNCTION_GET_GROUP_KEY, function (dataItem) {
                return {
                    groupName:mapping.FUNCTION_GET_GROUP_DATA(dataItem)
                };
            }, mapping.FUNCTION_COMPARE_GROUPS);

            if (mapping.USE_GROUPS_AS_DATASOURCE) {
                component.itemDataSource = list.groups.dataSource;
            } else {
                component.itemDataSource = list.dataSource;
                component.groupDataSource = list.groups.dataSource;
            }
        } else {
            component.itemDataSource = list.dataSource;
        }
    };

    ns.addMappingRendererType(ns.ListViewRenderer);

    ns.prepareWinBindAttributes = function(ds) {
        for (var ind in ds.responseMapping) {
            ns.attachWinBindAttributesRecursively(ds.responseMapping[ind]);
        }
    };

    ns.attachWinBindAttributesRecursively = function(entry) {
        if (entry.SET != undefined && entry.SET instanceof Array) {
            for (var ind in entry.SET) {
                ns.attachWinBindAttributesRecursively(entry.SET[ind]);
            }
        } else {
            var element = window.document.getElementById(entry.ID);
            if (element != undefined) {
                element.setAttribute("data-win-bind", (entry.ATTR == "@" ? "innerText" : entry.ATTR) + ":" + entry.PATH[0]);
            }
        }
    };

}(this.$t = this.$t || {}));

