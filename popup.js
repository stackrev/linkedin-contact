// Function to create HTML elements
function createElement(tagName, attributes = {}, textContent = '') {
  const element = document.createElement(tagName);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  element.textContent = textContent;
  return element;
}

// Function to display the profile data
function displayProfile(profileData) {
  const column1 = document.getElementById('column1');
  const column2 = document.getElementById('column2');

  // Create profile image
  const avatarImg = createElement('img', {
    src: profileData.avatar,
    alt: 'Profile Picture',
    class: 'avatar'
  });

  // Create profile information
  const fullName = createElement('h1', {}, profileData.fullName);
  const gender = createElement('p', {}, `Gender: ${profileData.gender}`);
  const location = createElement('p', {}, `Location: ${profileData.location}`);
  const title = createElement('h4', {}, `Title: ${profileData.title}`);
  const organization = createElement('h4', {}, `Org: ${profileData.organization}`);
  const bio = createElement('p', {}, `Bio: ${profileData.bio}`);

  // Create social media links
  const twitterLink = createElement('a', {
    href: profileData.twitter,
    target: '_blank'
  }, 'Twitter');
  const linkedinLink = createElement('a', {
    href: profileData.linkedin,
    target: '_blank'
  }, 'LinkedIn');

  details = profileData.details;
  // Create education section
  const educationHeading = createElement('h2', {}, 'Education');
  const educationList = createElement('ul');

  details.education.forEach(education => {
    const educationItem = createElement('li', {}, `${education.degree} - ${education.name}`);
    educationList.appendChild(educationItem);
  });

  // Create employment section
  const employmentHeading = createElement('h2', {}, 'Employment');
  const employmentList = createElement('ul');

  details.employment.forEach(employment => {
    const employmentItem = createElement('li', {}, `${employment.title} at ${employment.name}`);
    employmentList.appendChild(employmentItem);
  });

  // Create locations section
  const locationsHeading = createElement('h2', {}, 'Locations');
  const locationsList = createElement('ul');

  details.locations.forEach(location => {
    const locationItem = createElement('li', {}, location.formatted);
    locationsList.appendChild(locationItem);
  });

  // Append elements to columns
  column1.appendChild(avatarImg);
  column1.appendChild(fullName);
  column1.appendChild(gender);
  column1.appendChild(location);
  column1.appendChild(twitterLink);
  column1.appendChild(linkedinLink);
  column1.appendChild(title);
  column1.appendChild(organization);
  column1.appendChild(bio);

  column2.appendChild(educationHeading);
  column2.appendChild(educationList);
  column2.appendChild(employmentHeading);
  column2.appendChild(employmentList);
  column2.appendChild(locationsHeading);
  column2.appendChild(locationsList);
}


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  document.getElementById('url').textContent = url;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer {ENRICH_API_KEY}");

  var raw = JSON.stringify({
    "profiles": [
      {
        "service": "linkedin",
        "url": url
      }
    ]
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  // Send the URL to your API
  fetch("https://api.fullcontact.com/v3/person.enrich", requestOptions)
    .then(response => response.json())
    .then(data => {
      // Display the API response
      displayProfile(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
