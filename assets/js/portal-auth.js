function unlockPortal(portalId, correctPassword) {
  const input = prompt("Enter password:");
  if (input === correctPassword) {
    document.getElementById(portalId).style.display = "block";
  } else {
    alert("Incorrect password.");
  }
}
