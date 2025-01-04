// Function to get query parameters
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryArray = queryString.split("&");
    queryArray.forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    });
    return params;
  }
  
  // Retrieve the score from query parameters and display it
  const params = getQueryParams();
  const finalScore = params.score;
  document.getElementById("finalScore").innerText = finalScore;

