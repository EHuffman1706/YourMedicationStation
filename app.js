
document.addEventListener('DOMContentLoaded', loadEntries);

document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const profile = document.getElementById('profile-select').value;
  const name = document.getElementById('med-name').value;
  const time = document.getElementById('med-time').value;
  const dosage = document.getElementById('med-dosage').value;

  if (!profile || !name || !time || !dosage) return;

  const entry = { profile, name, time, dosage };
  saveEntry(entry);
  addEntryToDOM(entry);
  document.getElementById('med-form').reset();
});

function saveEntry(entry) {
  let entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.push(entry);
  localStorage.setItem('medEntries', JSON.stringify(entries));
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.forEach(entry => addEntryToDOM(entry));
}

function addEntryToDOM(entry) {
  const { profile, name, time, dosage } = entry;

  const li = document.createElement('li');
  const textSpan = document.createElement('span');
  textSpan.textContent = `${name} at ${time} — ${dosage} (Taken by: ${profile})`;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const newName = prompt('Edit medication name:', name);
    const newTime = prompt('Edit time:', time);
    const newDosage = prompt('Edit dosage:', dosage);
    const newProfile = prompt('Edit profile name:', profile);
    if (newName && newTime && newDosage && newProfile) {
      entry.name = newName;
      entry.time = newTime;
      entry.dosage = newDosage;
      entry.profile = newProfile;
      updateStorage();
      location.reload();
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    deleteEntry(entry);
    li.remove();
  };

  li.appendChild(textSpan);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  document.getElementById('med-list').appendChild(li);
}

function deleteEntry(entryToDelete) {
  let entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries = entries.filter(entry =>
    !(entry.name === entryToDelete.name &&
      entry.time === entryToDelete.time &&
      entry.dosage === entryToDelete.dosage &&
      entry.profile === entryToDelete.profile)
  );
  localStorage.setItem('medEntries', JSON.stringify(entries));
}

function updateStorage() {
  const listItems = document.querySelectorAll('#med-list li');
  const updatedEntries = Array.from(listItems).map(li => {
    const text = li.firstChild.textContent;
    const match = text.match(/(.+) at (.+) — (.+) \(Taken by: (.+)\)/);
    if (!match) return null;
    const [, name, time, dosage, profile] = match;
    return { name, time, dosage, profile };
  }).filter(Boolean);
  localStorage.setItem('medEntries', JSON.stringify(updatedEntries));
}
