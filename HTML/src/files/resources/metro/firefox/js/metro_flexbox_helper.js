//*********
//TODO: refactoring all script
//**********

flexBox = (function(){

    //configure:
    var DIRECTION = {
        ROW: "flx_direction_row",
        COLUMN: "flx_direction_column",
        ROW_REWERSE: "flx_direction_row-reverse",
        COLUMN_REWERSE: "flx_direction_column-reverse"
    }
    var ALIGN = {
        START: "flx_align_start",
        END: "flx_align_end",
        CENTER: "flx_align_center",
        STRETCH: "flx_align_stretch",
        BASELINE: "flx_align_baseline"
    }
    var PAK = {
        END: "flx_pack_end",
        CENTER: "flx_pack_center",
        JUSTIFY: "flx_pack_justify"
    }
    var WRAP = {
        NONE: "flx_wrap_none",
        WRAP: "flx_wrap_wrap",
        WRAP_REVERS: "flx_wrap_wrap-reverse"
    }
    var WRAPPER = "flexbox-wrapper";
    var CHILD = "flx_metro_child";

    var mode;

    // protected metods:
    var _styleToEvent = function(obj){
        $(obj).each(function(){
            var el = $(this);//TODO: delete
            var classes = el.attr("class");
            var styleArray = classes.split(" ");
            _setMode(classes);
            var elements;

            //TODO
            if( classes.indexOf(DIRECTION.COLUMN)!= -1 || classes.indexOf(DIRECTION.COLUMN_REWERSE) != -1 ){
                elements = _makeColumn(el);
                _setFlexSize(elements, parseInt( el.innerHeight() ) );
                if(classes.indexOf(PAK.JUSTIFY) != -1){
                    _setColJustify(el, elements);
                }

            } else {
                elements = _makeRows(el);
                _setFlexSize(elements, parseInt( el.innerWidth() ) );

                if(classes.indexOf(PAK.JUSTIFY) != -1){
                    _setRowJustify(el, elements);
                }

            }

            if( _isNeedCalculate(classes)  ){

                if( classes.indexOf(ALIGN.STRETCH)!= -1  ){
                    if(classes.indexOf(DIRECTION.ROW)!=-1 || classes.indexOf(DIRECTION.ROW_REWERSE)!=-1){
                        _setStrechHeight(el);
                    } else {
                        _setStrechWidth(el, elements);
                    }
                }

            }

        });
    }

    var _setMode =  function(classes){
        if(classes.indexOf(DIRECTION.ROW)!=-1 || classes.indexOf(DIRECTION.ROW_REWERSE)!=-1 ){
            mode = "row";
        } else {
            mode = "col";
        }
    }

    var _setStrechHeight = function(flexWrapEl){
        var flexWrapEl = $(flexWrapEl)//TODO: delete
        var wrapHeight = parseInt( flexWrapEl.height() );
        var wrapWidth = parseInt( flexWrapEl.width() );
        var cildren = flexWrapEl.find("."+CHILD);

        var elements = _parseChildren(cildren, wrapWidth);

        var elmHeight = parseInt( wrapHeight / elements.length );

        cildren.height(elmHeight);

    }

    var _setStrechWidth = function(flexWrapEl, elements){
        var flexWrapEl = $(flexWrapEl)//TODO: delete
        var wrapWidth = parseInt( flexWrapEl.innerWidth() );
        var elmWidth = parseInt( wrapWidth / elements.length );

        flexWrapEl.find("."+CHILD).width(elmWidth);

    }

    var _parseChildren = function(cildren, size){
        var cildren = $(cildren)//TODO: delete
        var sumSizeCh = 0;
        var result = new Array();
            result[0] = new Array();

        var i = 0;
        var count = 0;
        var childSize = 0;
        var childSizeLast = 0;
        cildren.each(function(j){
            mode == "row" ?
                childSizeLast = parseInt( $(this).outerWidth() ) :
                childSizeLast = parseInt( $(this).outerHeight() ) ;
            childSize += childSizeLast;
            if( (childSize >= size) && (j != 0) ){
                childSize = childSizeLast;
                i++;
                count = 0;
                result[i] = new Array();
            }
            result[i][count] = this;
            count++;
        });
        return result;
    }

    var _isNeedCalculate = function(classes){
        return (
                classes.indexOf(ALIGN.STRETCH) != -1 ||
                classes.indexOf(PAK.JUSTIFY) != -1
            )
    }

    var _makeRows = function(flexWrapEl){
        var cildren = flexWrapEl.find("."+CHILD);
        var wrapWidth = parseInt( flexWrapEl.width() );
        return _parseChildren(cildren, wrapWidth);
    }

    var _makeColumn = function(el) {
        var el = $(el)//TODO: delete
        var cildren = el.find("."+CHILD);
        var wrapHeight = parseInt( el.height() );

        var elements = _parseChildren(cildren, wrapHeight);

        var helperBlock;
        for(i in elements){
            helperBlock = $("<div class='helper-flexbox helper-col'></div>");
            for(j in elements[i]){
                $(elements[i][j]).detach().appendTo(helperBlock);
            }
            helperBlock.appendTo(el);
        }

        return elements;
    }

    var _setRowJustify = function(flexWrapEl, elements) {
        var width = parseInt( flexWrapEl.innerWidth() )-1;
        var widthSum = 0;
        var margin;
//        var cildren == flexWrapEl.find("."+CHILD);
        //var elements = _parseChildren(cildren, width);
        for(i in elements) {
            for(j in elements[i]){
                widthSum += parseInt( $(elements[i][j]).outerWidth() );
            }
            margin = (width-widthSum)/(j);
            for(var j=0; j<elements[i].length-1; j++){
                $(elements[i][j]).css("margin-right", margin);
            }
            widthSum = 0;
        }

    }

    var _setColJustify = function(el, elements){
        var height = parseInt( el.height() );
        var heightSum = 0;
        var margin;
        for(i in elements) {
            for(j in elements[i]){
                heightSum += parseInt( $(elements[i][j]).outerHeight() );
            }
            margin = (height-heightSum)/(j);
            for(var j=0; j<elements[i].length-1; j++){
                $(elements[i][j]).css("margin-bottom", margin);
            }
            heightSum = 0;
        }
    }

    var _resetColumn = function(el){
        var el = $(el)//TODO: delete
        var colObj = el.find(".helper-flexbox");
        var innrHTML = "";
        if(colObj.length > 0){
            colObj.each(function(i){
                innrHTML += $(this).html();
                $(this).remove();
            });
            el.html(innrHTML);
        }
        return false;
    }

    var _setFlexSize = function(elements, wrapSize){
        for (i in elements){
            _setLineSize(elements[i], wrapSize);
        }
    }

    var _setLineSize = function(line, wrapSize){
        var config = new Array();
        var workSize = wrapSize;
        var allPiece = 0;
        var el;

        // analyse
        for (i in line){
            el = $(line[i]);
            config[i] = {};
            if( parseInt(el.attr("flexbox-pos"))>0 ){
		        allPiece += parseInt(el.attr("flexbox-pos"));
            } else if(el.attr("flexbox-size")){
                workSize -= parseInt(el.attr("flexbox-size"));                
            } else {
                mode == "row" ?
                    workSize -= parseInt(el.outerWidth()) :
                    workSize -= parseInt(el.outerHeight()) ;

            }
        }

        // make
        var onePiece = workSize / allPiece;
        var calcSize;
        var realSize;
        for (i in line){
            el = $(line[i]);
            if( parseInt(el.attr("flexbox-pos"))>0 ){
                calcSize = Math.round(parseInt(el.attr("flexbox-pos")) * onePiece);
                mode == "row" ?
                    el.width(calcSize) :
                    el.height(calcSize);
            }
        }

    }

    var _reset = function(el, cfg){
        _resetColumn(el);

        var el = $(el)//TODO: delete
        var chld = el.find("."+CHILD);
        chld.height("auto")
            .width("auto");
            //.css("margin-bottom", "auto")
            //.css("margin-right", "0");
        if( el.hasClass(DIRECTION.ROW) ){
            chld.each(function(i){
                var chilElm = $(this);
                var fbp = parseInt(chilElm.attr("flexbox-pos"));
                var fbn = parseInt(chilElm.attr("flexbox-neg"));
                var fbs = chilElm.attr("flexbox-size");
                var chilElm = $(this);
                if( fbp==0 && fbn==0){
                    chilElm.css("width", fbs+"px" );
                } else if (fbp>0 && fbn==0) {
                    chilElm.css("min-width", fbs+"px" );
                } else if (fbp==0 && fbn>0) {
                    chilElm.css("max-width", fbs+"px" );
                }
            });
        } else {
            chld.each(function(i){
                var chilElm = $(this);
                var fbp = parseInt(chilElm.attr("flexbox-pos"));
                var fbn = parseInt(chilElm.attr("flexbox-neg"));
                var fbs = chilElm.attr("flexbox-size");
                var chilElm = $(this);
                if( fbp==0 && fbn==0){
                    chilElm.css("height", fbs+"px" );
                } else if (fbp>0 && fbn==0) {
                    chilElm.css("min-height", fbs+"px" );
                } else if (fbp==0 && fbn>0) {
                    chilElm.css("max-height", fbs+"px" );
                }
            });
        }

    }

    return {
        refresh: function(){
            //console.log($("."+WRAPPER).length+"----------------------------------------------");
            $("."+WRAPPER).each(function(){
                var el = $(this);
                _reset(el);
                if(el.hasClass(WRAP.WRAP) || el.hasClass(WRAP.WRAP_REVERS) ){
                    _styleToEvent(el);
                }
            });
        }
    }
})();