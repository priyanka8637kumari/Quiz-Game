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
  
  const params = getQueryParams();
  const finalScore = params.score;
  document.getElementById("finalScore").innerText = finalScore;

