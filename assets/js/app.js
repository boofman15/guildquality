/**
 * Main application js file
 * Created by jasonking on 3/7/17.
 */

/*********************************************
 * Check browser compatibility and initialize
 **********************************************/
$(document).ready(function () {
    //Since application uses HTML5 FileAPI, make sure browser supports it
    if (window.FileReader) {
        initializeEventListeners();
    } else {
        alert('Please use a modern browser to use this tool.')
    }
});

/**********************************
 * Initialize all event listeners
 ***********************************/
function initializeEventListeners() {

    // Initialize file upload input change event
    $('.file-input input').change(function (event) {
        //Take selected file and start processing
        processFileAsText(this.files[0]);
    });

    // Initialize Map It button
    $('#mapItBtn').click(function (event) {
        mapAddresses();
    });
}

/**************************************************
 * Functions to process csv file and display in table
 ***************************************************/

//Grab file uploaded and read it
function processFileAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory
    reader.readAsText(fileToRead);

    //Setup event listeners for successful load and error
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

// File is loaded now process results
function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

//Process data and write to HTML table
function processData(csv) {

    //Process data
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }

    //Now loop through each array and sub array and build htl table
    var table = "";
    for (var i=0; i< lines.length; i++) {
        table = table + "<tr>";
        var addressLine = lines[i];
        for (var k=0; k< addressLine.length; k++) {
            table = table + "<td>" + addressLine[k] + "</td>";
        }
        table = table + "</tr>";
    }

    $('#list tr:last').after(table);
    $('.dataMappingPage').removeClass('hidden')

}

// Error
function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Can't read file !");
    }
}

/**********************************************************************
 * Functions to get mapped data and display on a map
 *********************************************************************/
function mapAddresses() {

    //Loop through table headers and get what each column is mapped to
    var mappingColumns = [];
    var table = $("#list");
    table.find('th').each(function (key, value) {
        $(this).find('.mappingValue').each(function (key, value) {
            mappingColumns.push($(value).val());
        });
    });

    //Now compare those mapped values to the correct order needed for mapping
    var correctOrder = ['address', 'city', 'state', 'zip', 'category'];
    var correctMappedOrder = [];
    //Loop through correct order and find out which columns have each data
    for (var i=0; i< correctOrder.length; i++) {
        var indexValue = $.inArray(correctOrder[i], mappingColumns);
        correctMappedOrder.push(indexValue);
    }

    //now loop through table data, grab columns in right order based on correctMappedorder array and map
    // uh-oh... ran out of time

    applyToMap([51.505, -0.09]);
    $('.mapPage').removeClass('hidden');
}

// Apply coordinates to map
function applyToMap(coordinates) {
    var mymap = L.map('mapArea').setView([51.505, -0.09], 13);

    //Get HTML table with all addresses areas and map them
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    L.marker([51.505, -0.09]).addTo(mymap)
        .bindPopup("<b>Address</b><br />Here is an address.").openPopup();
}
