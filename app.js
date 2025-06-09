
document.addEventListener('DOMContentLoaded', loadEntries);

document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const entry = {
    profile: document.getElementById('profile-select').value,
    name: document.getElementById('med-name').value,
    time: document.getElementById('med-time').value,
    dosage: document.getElementById('med-dosage').value,
    instruction: document.getElementById('med-instruction').value,
    notes: document.getElementById('med-notes').value,
    temporary: document.getElementById('med-temporary').checked,
    startDate: document.getElementById('med-start-date').value,
    endDate: document.getElementById('med-end-date').value,
    noRefills: document.getElementById('med-no-refills').checked
  };
  saveEntry(entry);
  addEntryToDOM(entry);
  document.getElementById('med-form').reset();
});

function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.push(entry);
  localStorage.setItem('medEntries', JSON.stringify(entries));
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.forEach(entry => addEntryToDOM(entry));
}

function addEntryToDOM(entry) {
  const { profile, name, time, dosage, instruction, notes, temporary, startDate, endDate, noRefills } = entry;
  const li = document.createElement('li');
  li.innerHTML = \`
    <strong>\${name}</strong> at \${time} — \${dosage} (Taken by: \${profile})<br>
    <em>Instructions:</em> \${instruction || 'None'}<br>
    <em>Temporary:</em> \${temporary ? 'Yes' : 'No'}<br>
    <em>Start:</em> \${startDate || 'N/A'}<br>
    <em>End:</em> \${endDate || 'N/A'}<br>
    <em>No Refills:</em> \${noRefills ? 'Yes' : 'No'}<br>
    <em>Notes:</em> \${notes || 'None'}
  \`;
  document.getElementById('current-med-list').appendChild(li);
}
