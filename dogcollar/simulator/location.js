var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Location", 
				name : "Analog Input", 
				iconVariant : PinsSimulators.SENSOR_SLIDER 
			},
			axes : [{
				ioType : "input",
				dataType : "float",
				valueLabel : "Latitude",
				valueID : "latValue",
				minValue : -90,
				maxValue : 90,
				value : 0,
				speed : 0.5,
				defaultControl : PinsSimulators.SLIDER
			},
			{
				ioType : "input",
				dataType : "float",
				valueLabel : "Longitude",
				valueID : "lngValue",
				minValue : -180,
				maxValue : 180,
				value : 0,
				speed : 0.5,
				defaultControl : PinsSimulators.SLIDER
					
			}]
		});
}

exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.read = function() {
	var tmp = this.pinsSimulator.delegate("getValue");
	return tmp
}

exports.pins = {
  lat: { type: "A2D" },
  lng: { type: "A2D" }
};