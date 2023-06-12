chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  document.getElementById("url").textContent = url;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer {ENRICH_API_KEY}");

  var raw = JSON.stringify({
    profiles: [
      {
        service: "linkedin",
        url: url,
      },
    ],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  // Send the URL to your API
  fetch("https://api.fullcontact.com/v3/person.enrich", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Display the API response
      document.getElementById("api-response").textContent =
        JSON.stringify(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
