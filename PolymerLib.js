//V1.2

if(typeof require !== 'undefined'){
    var Logger = require("pavlism-logger");
}

var log = new Logger('Lib.Polymer.js', Logger.level.error);

PolymerLib = {};

/**
 * This will trigger an event for an element.  It will check for the ID and Class.  If the ID exsits it will trigger {ID}eventName.
 * If the class exists it will trigger {Class}eventName.  If niether exists it will trigger eventName.  
 * 
 * @param element {element} The element that will fire the event.
 * @param triggerObj {object} The object that will be passed along when the event is triggered.
 * @param eventName {string} The event string.
 */
		 
PolymerLib.triggerEvents = function (element, triggerObj, eventName) {
	log.trace("triggerEvent");
	var id = element.id;
	if (!Lib.JS.isDefined(id)) {
		id = '';
	}

	var strClass = element.class;
	if (!Lib.JS.isDefined(strClass)) {
		strClass = '';
	}

	if (id === '' && strClass === '') {
		EventBroker.trigger(eventName, triggerObj);
	} else {
		if (id !== '') {
			EventBroker.trigger(id + "_" + eventName, triggerObj);
		}
		if (strClass !== '') {
			EventBroker.trigger(strClass + "_" + eventName, triggerObj);
		}
	}
};

/**
         * This will trigger an event for an element.  It will check for the ID and Class.  If the ID exsits it will trigger {ID}eventName.
         * If the class exists it will trigger {Class}eventName.  If niether exists it will trigger eventName.  this will also check for a 
         * tableRow property in the element, if it's exists then add it to the triggerObj.
         * 
         * @param element {element} The element that will fire the event.
         * @param triggerObj {object} The object that will be passed along when the event is triggered.
         * @param eventName {string} The event string.
         */
PolymerLib.triggerEventsWithTable = function (element, triggerObj, eventName) {
	log.trace("triggerEvent");
	var tableRow = element.get('tableRow');

	if (Lib.JS.isDefined(tableRow) && tableRow !== '') {
		triggerObj.tableRow = tableRow;
	}
	PolymerLib.triggerEvents(element, triggerObj, eventName);
};
/**
 * This will create a string representation of an element.  It is designed to work with <mrp-table> and is elements.
 * If the element doesn't have any children then it will use the Jquery trim().  If not it will try to run
 * a element.val() function on all the children.
 * 
 * @param array {array} The array the will be copied
 * @return {array} Returns a new array not connected to the old one.
 */
PolymerLib.elementToString = function (element, useJSON) {
	log.trace("triggerEvent");
	var strRep = '';
	if ($(element).children(":not('dom-if')").length === 0) {
		//must be simple text
		strRep = $(element).text().trim();
	} else if ($(element).children("span.object-toggle").length) {
		var strCell = $(element).text().trim().cleanText();
		if (useJSON) {
			var obj = {};
			var lines = strRep.split('\n');
			obj[lines[0]] = {};
			for (var lineConter = 0; lineConter < lines.length; lineConter++) {
				var parts = lines[lineConter].split(':');
				obj[lines[0]][parts[0]] = parts[1];
			}
			strRep = JSON.stringify(obj);
			strRep = Lib.JS.replace(strRep, ",", " ");
		}
	} else {
		$(element).children(":not('dom-if')").each(function (index, element) {
			if (Lib.JS.isDefined(element.val)) {
				strRep = strRep + element.val().trim();
			} else if ($(element).is('a')) {
				strRep = strRep + $(element).attr('href');
			} else {
				strRep = strRep + $(element).val().trim();
			}
		});
	}
	return strRep;
};
		
if(typeof require !== 'undefined'){
    module.exports = JS;
}else{
    Lib.Polymer = PolymerLib;
}