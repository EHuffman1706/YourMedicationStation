
document.addEventListener('DOMContentLoaded', loadEntries);

document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const profile = document.getElementById('profile-select').value;
  const name = document.getElementById('med-name').value;
  const time = document.getElementById('med-time').value;
  const dosage = document.getElementById('med-dosage').value;
  const instruction = document.getElementById('med-instruction').value;
  const notes = document.getElementById('med-notes').value;

  if (!profile || !name || !time || !dosage) return;

  const entry = { profile, name, time, dosage, instruction, notes };
  saveEntry(entry);
  addEntryToDOM(entry);
  document.getElementById('med-form').reset();
});

function formatTime(time24) {
  const [hour, minute] = time24.split(':');
  const h = parseInt(hour);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
}

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
  const { profile, name, time, dosage, instruction, notes } = entry;
  const formattedTime = formatTime(time);

  const li = document.createElement('li');
  const textSpan = document.createElement('span');
  textSpan.innerHTML = `
    <strong>${name}</strong> at ${formattedTime} — ${dosage} (Taken by: ${profile})<br>
    <em>Instructions:</em> ${instruction || 'None'}<br>
    <em>Notes:</em> ${notes || 'None'}
  `;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';

  editBtn.onclick = () => {
    const nameField = prompt('Edit medication name:', name);
    const timeField = prompt('Edit time:', time);
    const dosageField = prompt('Edit dosage:', dosage);
    const profileField = prompt('Edit profile name:', profile);
    const instructionField = prompt('Edit instructions:', instruction);
    const notesField = prompt('Edit notes:', notes);

    if (nameField && timeField && dosageField && profileField) {
      entry.name = nameField;
      entry.time = timeField;
      entry.dosage = dosageField;
      entry.profile = profileField;
      entry.instruction = instructionField;
      entry.notes = notesField;
      saveBtn.style.display = 'inline-block';
    }
  };

  saveBtn.onclick = () => {
    updateEntry(entry);
    location.reload();
  };

  deleteBtn.onclick = () => {
    const modal = document.getElementById('confirm-modal');
    const overlay = document.getElementById('modal-overlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';

    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    yesBtn.focus();

    yesBtn.onclick = () => {
      deleteEntry(entry);
      li.remove();
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };

    noBtn.onclick = () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };

      deleteEntry(entry);
      li.remove();
    }
  };

  li.appendChild(textSpan);
  li.appendChild(editBtn);
  li.appendChild(saveBtn);
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

function updateEntry(updatedEntry) {
  let entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  const index = entries.findIndex(entry =>
    entry.name === updatedEntry.name &&
    entry.time === updatedEntry.time &&
    entry.dosage === updatedEntry.dosage &&
    entry.profile === updatedEntry.profile
  );
  if (index !== -1) {
    entries[index] = updatedEntry;
    localStorage.setItem('medEntries', JSON.stringify(entries));
  }
}
