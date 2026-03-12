fetch("data.json")
.then(response => response.json())
.then(data => {

document.getElementById("totalJobs").innerText = data.length;

/* stats */

let companiesSet = new Set();
let locationsSet = new Set();

data.forEach(job => {

companiesSet.add(job.company);
locationsSet.add(job.location);

});

document.getElementById("totalCompanies").innerText = companiesSet.size;
document.getElementById("totalLocations").innerText = locationsSet.size;


/* table */

const table = document.getElementById("jobsTable");

data.forEach(job => {

let row = `
<tr>
<td>${job.title}</td>
<td>${job.company}</td>
<td>${job.location}</td>
</tr>
`;

table.innerHTML += row;

});


/* location stats */

let locations = {};

data.forEach(job => {

let location = job.location;
locations[location] = (locations[location] || 0) + 1;

});


/* location dropdown */

const locationFilter = document.getElementById("locationFilter");

Object.keys(locations).forEach(loc => {

let option = document.createElement("option");
option.value = loc;
option.textContent = loc;

locationFilter.appendChild(option);

});


/* location chart (clickable) */

const locationChart = new Chart(document.getElementById("locationChart"), {
type: "bar",
data: {
labels: Object.keys(locations),
datasets: [{
label: "Jobs per Location",
data: Object.values(locations)
}]
},
options: {
onClick: function(event, elements){

if(elements.length > 0){

let index = elements[0].index;
let selectedLocation = this.data.labels[index];

filterByLocation(selectedLocation);

}

}
}
});


/* filter by location from chart */

function filterByLocation(city){

let rows = document.querySelectorAll("#jobsTable tr");

rows.forEach(row => {

let location = row.children[2].textContent;

if(location === city){
row.style.display = "";
}else{
row.style.display = "none";
}

});

}


/* companies chart */

let companies = {};

data.forEach(job => {

let company = job.company;
companies[company] = (companies[company] || 0) + 1;

});

new Chart(document.getElementById("companyChart"), {
type: "pie",
data: {
labels: Object.keys(companies).slice(0,10),
datasets: [{
label: "Top Companies",
data: Object.values(companies).slice(0,10)
}]
}
});


/* search + location filter */

const searchInput = document.getElementById("searchInput");

function filterJobs(){

let jobSearch = searchInput.value.toLowerCase();
let locationSearch = locationFilter.value.toLowerCase();

let rows = document.querySelectorAll("#jobsTable tr");

let visibleJobs = [];

rows.forEach(row => {

let title = row.children[0].textContent.toLowerCase();
let company = row.children[1].textContent;
let location = row.children[2].textContent.toLowerCase();

let matchJob = title.includes(jobSearch);
let matchLocation = location.includes(locationSearch);

if(matchJob && matchLocation){
row.style.display = "";

visibleJobs.push({
company: company,
location: row.children[2].textContent
});

}else{
row.style.display = "none";
}

});

/* update charts */

updateCharts(visibleJobs);

}

searchInput.addEventListener("keyup", filterJobs);
locationFilter.addEventListener("change", filterJobs);

function updateCharts(filteredJobs){

let companyCounts = {};
let locationCounts = {};

filteredJobs.forEach(job => {

companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;

});

companyChart.data.labels = Object.keys(companyCounts);
companyChart.data.datasets[0].data = Object.values(companyCounts);
companyChart.update();

locationChart.data.labels = Object.keys(locationCounts);
locationChart.data.datasets[0].data = Object.values(locationCounts);
locationChart.update();

}

/* download csv */

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function(){

let csv = "Title,Company,Location\n";

data.forEach(job => {
csv += `${job.title},${job.company},${job.location}\n`;
});

let blob = new Blob([csv], { type: "text/csv" });

let url = URL.createObjectURL(blob);

let a = document.createElement("a");

a.href = url;
a.download = "jobs_data.csv";

a.click();

});
/* dark mode */

const darkBtn = document.getElementById("darkModeBtn");

darkBtn.addEventListener("click", function(){

document.body.classList.toggle("dark-mode");

});
});