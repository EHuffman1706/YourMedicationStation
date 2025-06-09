
document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('med-name').value;
  const time = document.getElementById('med-time').value;
  const dosage = document.getElementById('med-dosage').value;

  if (!name || !time || !dosage) return;

  const entry = document.createElement('li');
  entry.textContent = `${name} at ${time} — ${dosage}`;
  document.getElementById('med-list').appendChild(entry);

  document.getElementById('med-form').reset();
});
