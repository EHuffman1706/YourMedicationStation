
const currentlyTakingCheckbox = document.getElementById('currentlyTaking');
const addDateButtons = document.getElementById('addDateButtons');
const startDateWrapper = document.getElementById('startDateWrapper');
const endDateWrapper = document.getElementById('endDateWrapper');
const showStartDateBtn = document.getElementById('showStartDateBtn');
const showEndDateBtn = document.getElementById('showEndDateBtn');

currentlyTakingCheckbox.addEventListener('change', () => {
  if (currentlyTakingCheckbox.checked) {
    addDateButtons.style.display = 'block';
    startDateWrapper.style.display = 'none';
    endDateWrapper.style.display = 'none';
  } else {
    addDateButtons.style.display = 'none';
    startDateWrapper.style.display = 'block';
    endDateWrapper.style.display = 'block';
  }
});

showStartDateBtn.addEventListener('click', () => {
  startDateWrapper.style.display = 'block';
});

showEndDateBtn.addEventListener('click', () => {
  endDateWrapper.style.display = 'block';
});
