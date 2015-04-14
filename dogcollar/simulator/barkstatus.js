var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Barking", 
				name : "Analog Input", 
				iconVariant : PinsSimulators.SENSOR_SLIDER 
			},
			axes : [
				new PinsSimulators.AnalogInputAxisDescription(
					{
						valueLabel : "Barking",
						valueID : "barkValue",
						defaultControl : PinsSimulators.SLIDER,
						value : 0,
						minValue : 0,
						maxValue : 113, //largest decibel rating for a dog bark
					}
				),
			]
		});
}

exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.read = function() {
  return this.pinsSimulator.delegate("getValue");
}

exports.pins = {
  bark: { type: "A2D" }
};