//@module

exports.pins = {
    happy: { type: "A2D" }
};

exports.configure = function(){
	this.happy.init();
}

exports.read = function() {
    return { happy: this.happy.read()};
}


