
// NOTE: You do not need to edit this file.

// NASA's APOD API only has images from June 16, 1995 onwards
const earliestDate = '1995-06-16';

// Get today's date in YYYY-MM-DD format (required by date inputs)
const today = new Date().toISOString().split('T')[0];

function setupDateInputs(startInput, endInput) {
  // Restrict date selection range from NASA's first image to today
  startInput.min = earliestDate;
  startInput.max = today;
  endInput.min = earliestDate;
  endInput.max = today;

  // Default: Show the most recent 10 days of space images
  const lastRange = new Date();
  lastRange.setDate(lastRange.getDate() - 9); // minus 9 to include today in a 10-day range
  startInput.value = lastRange.toISOString().split('T')[0];
  endInput.value = today;

  // Automatically adjust end date to show exactly 10 days of images
  startInput.addEventListener('change', () => {
    const startDate = new Date(startInput.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 9);
    endInput.value = endDate > new Date(today) ? today : endDate.toISOString().split('T')[0];
  });
}
