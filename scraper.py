import requests
from bs4 import BeautifulSoup
import json

# website URL
url = "https://realpython.github.io/fake-jobs/"

# send request
response = requests.get(url)

# parse HTML
soup = BeautifulSoup(response.text, "html.parser")

# find all job cards
jobs = soup.find_all("div", class_="card-content")

data = []

# loop through jobs
for job in jobs:

    title = job.find("h2", class_="title").text.strip()
    company = job.find("h3", class_="company").text.strip()
    location = job.find("p", class_="location").text.strip()

    data.append({
        "title": title,
        "company": company,
        "location": location
    })

# save data to JSON
with open("data.json", "w") as f:
    json.dump(data, f, indent=4)

print("Data saved!")