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

function loadResults(page_number) {
	//Grab the values from the filters
	var page = page_number || 1
	var company = document.getElementById('company-menu').value;
	if (company == "") {company = undefined}
	var category = document.getElementById('category-menu').value;
	if (category == "") {category = undefined}
	var location = document.getElementById('location-menu').value;
	if (location == "") {location = undefined}
	var level = document.getElementById('level-menu').value;
	if (level == "") {level = undefined}
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

	var current_page_num = parseInt(results.page)
	var max_page_num = parseInt(results.page_count)

	//Create the page buttons
	//First page
	var first_page = document.createElement('a')
	first_page.setAttribute('class', "page-number")
	first_page.innerHTML = 'First'
	first_page.addEventListener('click', function(){
    	loadResults(1);
	});
	page_number_container.appendChild(first_page);

	//Previous page
	var previous_page = document.createElement('a')
	previous_page.setAttribute('class', "page-number")
	previous_page.innerHTML = 'Previous'
	previous_page.addEventListener('click', function(){
    	loadResults(Math.max(1, current_page_num - 1));
	});
	page_number_container.appendChild(previous_page);

	//Next page
	var next_page = document.createElement('a')
	next_page.setAttribute('class', "page-number")
	next_page.innerHTML = 'Next'
	next_page.addEventListener('click', function(){
    	loadResults(Math.min(99, max_page_num - 1, current_page_num + 1));
	});
	page_number_container.appendChild(next_page);

	//Last page
	var last_page = document.createElement('a')
	last_page.setAttribute('class', "page-number")
	last_page.innerHTML = 'Last'
	last_page.addEventListener('click', function(){
    	loadResults(Math.min(99, Math.max(1, max_page_num - 1)));
	});
	page_number_container.appendChild(last_page);
}