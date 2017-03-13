function search(filters) {
	var results;

	$.ajax({
			type: 'GET',
			url: 'https://api-v2.themuse.com/jobs',
			data: filters,
			async: false,
			success: function(response) {
				results = response
			},
			error: function(exception) {
				alert("There was an error in your search request! \n Error message: " + exception.error)
			}
		});
	return results;
}

function getSelections(elementId) {
	//takes selectionOptions from a multi select dropdown menu, and extracts the selected value strings
	//and puts them into an array
	var selections = Array.from(document.getElementById(elementId).selectedOptions)
	if(selections.length == 0) {
		out = undefined
	}
	else if(selections[0].value == "") {
		out = undefined
	}
	else {
		out = selections.map(function(a) {return a.value})
	}
	return out
}

function loadResults(page_number) {
	//Grab the values from the filters
	var page = page_number || 0
	var company = getSelections('company-menu')
	var category = getSelections('category-menu')
	var location = getSelections('location-menu')
	var level = getSelections('level-menu')

	var filters = {"page": page, "company": company, "category": category, "location": location, "level": level};
	var results = search(filters)

	//Get the results table
	var table = document.getElementById('search-results-table')
	table.innerHTML = null;

	//Create table header
	var table_header = document.createElement('tr')
	var header1 = document.createElement('th')
	header1.style="width:50%"
	header1.innerHTML="Name"
	var header2 = document.createElement('th')
	header2.style="width:25%"
	header2.innerHTML="Company"
	var header3 = document.createElement('th')
	header3.style="width:25%"
	header3.innerHTML="Location"
	table_header.appendChild(header1)
	table_header.appendChild(header2)
	table_header.appendChild(header3)
	table.appendChild(table_header)

	//Populate the table with the results
	for(var index in results.results) {
		//Wrap in closure so listing is not reevaluated on click.
		(function(listing) {
			var row = document.createElement('tr');
			
			var name_cell = document.createElement('td');
			try {
				name_cell.innerHTML = listing.name;
			}
			catch(err) {
				name_cell.innerHTML = "Unavailable";
				console.log(err)
			}

			var company_cell = document.createElement('td');
			try {
				company_cell.innerHTML = listing.company.name;
			}
			catch(err) {
				company_cell.innerHTML = "Unavailable";
				console.log(err)
			}

			var location_cell = document.createElement('td');
			try {
				if (listing.locations.length == 0) {locations = 'Unavailable'}
				else {
					locations = listing.locations.map(function(a) {return a.name})
				}
				location_cell.innerHTML = locations
			}
			catch(err) {
				location_cell.innerHTML = "Unavailable";
				console.log(err)
			}

			row.appendChild(name_cell)
			row.appendChild(company_cell)
			row.appendChild(location_cell)
			row.addEventListener('click', function(){
	    		window.open(listing.refs.landing_page);
			});
			
			table.appendChild(row);
		})(results.results[index]);
	}

	// Show pages for results
	page_number_container = document.getElementById("page-numbers-container")
	page_number_container.innerHTML = null
	number_results_container = document.getElementById("number-results-container")
	number_results_container.innerHTML = null

	var current_page_num = parseInt(results.page)
	var max_page_num = parseInt(results.page_count) - 1
	var total_hits = parseInt(results.total)

	//Tell user how many jobs were found
	current_hit = (current_page_num)*20 + 1
	through_hit = current_hit + 19
	number_results_container.innerHTML = 
	'Showing hits ' + String(current_hit) + "- " + String(through_hit) + " of " + String(total_hits) + " jobs!"

	//Create the page buttons
	//First page
	var first_page = document.createElement('a')
	first_page.setAttribute('class', "page-number")
	first_page.innerHTML = 'First'
	first_page.addEventListener('click', function(){
    	loadResults(0);
	});
	page_number_container.appendChild(first_page);

	//Previous page
	var previous_page = document.createElement('a')
	previous_page.setAttribute('class', "page-number")
	previous_page.innerHTML = 'Previous'
	previous_page.addEventListener('click', function(){
    	loadResults(Math.max(0, current_page_num - 1));
	});
	page_number_container.appendChild(previous_page);

	//Next page
	var next_page = document.createElement('a')
	next_page.setAttribute('class', "page-number")
	next_page.innerHTML = 'Next'
	next_page.addEventListener('click', function(){
    	loadResults(Math.min(99, max_page_num, current_page_num + 1));
	});
	page_number_container.appendChild(next_page);

	//Last page
	var last_page = document.createElement('a')
	last_page.setAttribute('class', "page-number")
	last_page.innerHTML = 'Last'
	last_page.addEventListener('click', function(){
    	loadResults(Math.min(99, Math.max(0, max_page_num)));
	});
	page_number_container.appendChild(last_page);
}