fetch("data.json")
.then(response => response.json())
.then(data => {

/* company stats */

let companies = {};
let locations = {};
let titles = {};

data.forEach(job => {

companies[job.company] = (companies[job.company] || 0) + 1;
locations[job.location] = (locations[job.location] || 0) + 1;
titles[job.title] = (titles[job.title] || 0) + 1;

});


/* company chart */

new Chart(document.getElementById("companyChart"),{

type:"bar",

data:{
labels:Object.keys(companies).slice(0,10),

datasets:[{
label:"Jobs by Company",
data:Object.values(companies).slice(0,10)
}]

}

});


/* location chart */

new Chart(document.getElementById("locationChart"),{

type:"pie",

data:{
labels:Object.keys(locations).slice(0,10),

datasets:[{
label:"Jobs by Location",
data:Object.values(locations).slice(0,10)
}]

}

});


/* titles chart */

new Chart(document.getElementById("titleChart"),{

type:"bar",

data:{
labels:Object.keys(titles).slice(0,10),

datasets:[{
label:"Top Job Titles",
data:Object.values(titles).slice(0,10)
}]

}

});

});