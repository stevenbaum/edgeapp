//@module

exports.pins = {
    foodWeight: { type: "A2D" }
};

exports.configure = function(){
	this.foodWeight.init();
}

exports.read = function() {
    return { foodWeight: this.foodWeight.read()};
}


