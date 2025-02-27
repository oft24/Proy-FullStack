document.getElementById('lolForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const tag = document.getElementById('tag').value;
  const lolInfoDiv = document.getElementById('lolInfo');

  try {
    const response = await fetch(`/api/lol/${username}/${tag}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    lolInfoDiv.innerHTML = JSON.stringify(data, null, 2);
  } catch (error) {
    lolInfoDiv.innerHTML = `Error: ${error.message}`;
  }
});
