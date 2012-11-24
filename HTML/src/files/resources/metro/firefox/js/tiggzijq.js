(function (ns) {
    "use strict";
    ns.persistentStorage = localStorage;
}(this.$t = this.$t || {}));

(function (ns) {
    "use strict";
}(this.$t.util = this.$t.util || 
{
	select:function(query){
       	    return document.querySelector(query);
	},
	selectAll:function(query){
           return document.querySelectorAll(query);
	},
	isFunction:$.isFunction,
	isArray:$.isArray,
	isWindow:$.isWindow,
	isNumeric:$.isNumeric,
	type:$.type,
	isPlainObject:$.isPlainObject,
	isEmptyObject:$.isEmptyObject,
	each:$.each,
	trim:$.trim,
	extend:$.extend,
	merge:$.merge,
	proxy:$.proxy,
	param:$.param,	
	parseJSON:$.parseJSON,
	parseXML:$.parseXML,
	xml2json:$.xml2json
}));

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
 * Implementation of Request for Firefox
 */
(function (namespace) {
    "use strict";

    namespace.Request = function (options) {
        this.options = options;
    };

    namespace.Request.prototype.send = function () {
        var _options = this.options;
        if (_options.type && _options.type !== 'get') {
            if (_options.dataType && _options.dataType.indexOf('xml') !== -1) {
                _options.data = namespace.util.dataToXml(_options.data);
            } else if (_options.dataType && _options.dataType.indexOf('json') !== -1 && JSON && (typeof JSON.stringify === 'function')) {
                _options.data = JSON.stringify(_options.data);
            }
        }
        jQuery.ajax(_options);       
    };

} (this.$t = this.$t || {}));

(function (ns) {
    "use strict";

	ns.initializeProperties = function(pack, extensions) {
	    var keys = Object.keys(extensions);
	    var props;
	    var i = 0, l;
	    for (l = keys.length; i < l; i++) {
	        var key = keys[i];
	        var enumerable = key.charCodeAt(0) !== /*_*/95;
	        var ext = extensions[key];
	        if (ext && typeof ext === 'object') {
	            if (ext.value !== undefined || typeof ext.get === 'function' || typeof ext.set === 'function') {
	                if (ext.enumerable === undefined) {
	                    ext.enumerable = enumerable;
	                }
	                props = props || {};
	                props[key] = ext;
	                continue;
	            }
	        }
	        if (!enumerable) {
	            props = props || {};
	            props[key] = { value: ext, enumerable: enumerable, configurable: true, writable: true }
	            continue;
	        }
	        pack[key] = ext;
	    }
	    if (props) {
	        Object.defineProperties(pack, props);
	    }
	}
	
	ns.Namespace = {};
	ns.Namespace.define = function(name, extensions) {
	    
	    var currentPackage = ns, packageParts = name.split(".");
	
	    for (var i = 0, l = packageParts.length; i < l; i++) {
	        var packageName = packageParts[i];
	        if (!currentPackage[packageName]) {
	            Object.defineProperty(currentPackage, packageName,
	                { value: {}, writable: false, enumerable: true, configurable: true }
	            );
	        }
	        currentPackage = currentPackage[packageName];
	    }
	
	    if (extensions) {
	        ns.initializeProperties(currentPackage, extensions);
	    }
	
	    return currentPackage;
	}

} (this.$t = this.$t || {}));
/**
 * Windows 8 - Preview - List View
 */
(function (ns) {
    "use strict";

    ns.Windows8PreviewListView = function (mapping, data) {
        ns.DefaultMappingRenderer.call(this, mapping, data);
    };

    ns.Windows8PreviewListView.prototype = new ns.DefaultMappingRenderer();
    ns.Windows8PreviewListView.prototype.constructor = new ns.Windows8PreviewListView();
    ns.Windows8PreviewListView.prototype.isSuitable = function (mapping) {
        var component = ns.util.select("#" + mapping.ID);
        return mapping.ID !== "___local_storage___" && component && component.getAttribute("tiggzi-control") === "Windows8.Preview.ListView";
    };

    ns.Windows8PreviewListView.prototype.render = function () {
        var mapping = this.mapping;

        var array = this.getValueFromPath(mapping.PATH, this.data);

        var component = ns.util.select("#" + mapping.ID);

        component.refreshLayout(array.length);

        for (var i = 0; i < array.length; ++i) {
            var item = array[i];
            var itemComponent = component.getItem(i);

            for (var mappingKey in mapping.SET) {
                if (mapping.SET.hasOwnProperty(mappingKey)) {
                    var elementMapping = mapping.SET[mappingKey];
                    var value = this.getValueFromPath(elementMapping.PATH, item);
                    var valueTransformation = elementMapping.TRANSFORMATION;
                    if(valueTransformation) {
                        value = valueTransformation(value);
                    }
                    if (elementMapping.ATTR == "@") {
                        itemComponent.find("#" + elementMapping.ID).append(value);
                    } else {
                        itemComponent.find("#" + elementMapping.ID).attr(elementMapping.ATTR, value);
                    }
                }
            }

            component.refreshItemLayout(i);
        }
    };

    ns.addMappingRendererType(ns.Windows8PreviewListView);

}(this.$t = this.$t || {}));
