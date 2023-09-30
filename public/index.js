
// add event listener for window load
window.addEventListener('load', init);

// initialize application
async function init () {
  await getQRCode();
  await getDetails();
  // handle user interaction
  document.getElementById("submit").addEventListener("click", submit);
  document.getElementById("token").addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      submit();
    }
  });
}

// get qr code for img tag
async function getQRCode () {
  let data;
  try {
    let response = await fetch(`${document.location.pathname.replace(/\/$/, "")}/api/qrcode`);
    data = await response.json();
  }
  catch (error) {
    return setError(`Failed to get QR code form img tag. ${error.message}`);
  }
  document.getElementById("qrcode").innerHTML = `<img src="${data.qrcode}">`;
}

// get the authentication details
async function getDetails () {
  let data;
  try {
    let response = await fetch(`${document.location.pathname.replace(/\/$/, "")}/api/details`);
    data = await response.json();
  }
  catch (error) {
    return setError(`Failed to get details. ${error.message}`);
  }
  // show details
  document.getElementById("type").value = data.type;
  document.getElementById("digits").value = data.digits;
  document.getElementById("algorithm").value = data.algorithm;
  document.getElementById("interval").value = data.interval;
  document.getElementById("secret").value = data.secret;
  document.getElementById("uri").value = data.uri;
}

// submit user entered token for validation
async function submit () {
  clearError();
  let token = document.getElementById("token").value;
  let data;
  try {
    let response = await fetch(`${document.location.pathname.replace(/\/$/, "")}/api/auth`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });
    data = await response.json();
  }
  catch (error) {
    return setError(error);
  }
  console.log(data)
  document.getElementById("token").style.background = data.valid ? "#8f8" : "#f88";
  if (!data.valid) setError("Invalid token.");
}

function setError (error) {
  document.getElementById("errors").innerHTML += error.toString();
}

function clearError () {
  document.getElementById("errors").innerHTML = "";
}