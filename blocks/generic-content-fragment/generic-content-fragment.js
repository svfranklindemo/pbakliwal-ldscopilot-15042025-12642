// put your AEM publish address here
// this fixes having to manually change the AEM host here
const AEM_HOST = checkDomain()

function checkDomain(){
    return "https://publish-p121371-e1189853.adobeaemcloud.com/"    
}

export default function decorate(block) {
  // Get the slug from the first div
  const slugDiv = block.querySelector('div:nth-child(1)'); 
  const slugID = document.createElement('div');
  slugID.id = 'slug';
  slugDiv.replaceWith(slugID);
  slugID.innerHTML = `${slugDiv.innerHTML}`;
  const slug = slugID.textContent.trim();

  // Mark this block for later rendering
  block.setAttribute('data-adventure-slug', slug);

  // Only fetch and render once per slug
  if (!window._adventureRendered) window._adventureRendered = {};
  if (window._adventureRendered[slug]) return;
  window._adventureRendered[slug] = true;

  // Fetch the adventure data
  fetch(AEM_HOST + '/graphql/execute.json/aem-demo-assets/generic-cf-by-slug;slug=' + slug, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': window.location.origin
    },
    credentials: 'same-origin',
    mode: 'cors'
  })
  .then(response => response.json())
  .then(response => {
    const adventure = response.data.genericCfList.items[0];
    const backgroundImage = adventure.primaryImage._path;
    const adventureTitle = adventure.title;
    const adventureDesc = adventure.description.plaintext;

    // Create the HTML structure
    const html = `
      <div class="cf-wrapper">
        <div class="text">
          <p>${adventureDesc}</p>
        </div>
      </div>
    `;

    // Find all blocks with this slug and render
    document.querySelectorAll('[data-adventure-slug="' + slug + '"]').forEach(block => {
      // Remove all children
      while (block.firstChild) block.removeChild(block.firstChild);
      // Insert the HTML
      block.innerHTML = html;
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.querySelectorAll('[data-adventure-slug="' + slug + '"]').forEach(block => {
      block.innerHTML = '<p>Error loading content fragment</p>';
    });
  });
}





