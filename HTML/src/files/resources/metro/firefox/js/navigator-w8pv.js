function Navigator() {
    var frame;

    var getInstance = function() {
        if (!Navigator.instance) {
            Navigator.instance = createInstance();
        }
        return Navigator.instance;
    };

    var createInstance = function() {
        return {
            init : function(frame) {
                this.locations = new Array();
                this.lastLocation = 0;
                this.frame = frame;
            },

            navigate : function(location) {
                console.log("navigation: from " + this.locations[this.lastLocation] + " to " + location);
                ++this.lastLocation;
                this.locations[this.lastLocation] = location;
                this.frame.attr("src", this.locations[this.lastLocation]);

                console.log(this.locations + " " + this.lastLocation);
            },

            back : function() {
                this.lastLocation;
                console.log("navigation: back from " + this.locations[this.lastLocation] + " to " + this.locations[this.lastLocation - 1]);
                --this.lastLocation;
                this.frame.attr("src", this.locations[this.lastLocation]);

                console.log(this.locations + " " + this.lastLocation);
            }
        }
    };

    return getInstance();
}