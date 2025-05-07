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
  block.setAttribute('data-genericContent-slug', slug);

  // Only fetch and render once per slug
  if (!window._genericContentRendered) window._genericContentRendered = {};
  if (window._genericContentRendered[slug]) return;
  window._genericContentRendered[slug] = true;

  // Fetch the genericContent data
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
    // Null checks for data structure
    if (!response || !response.data || !response.data.genericCfList || !Array.isArray(response.data.genericCfList.items) || response.data.genericCfList.items.length === 0) {
      // Remove all blocks with this slug if data is missing
      document.querySelectorAll('[data-genericContent-slug="' + slug + '"]').forEach(block => {
        while (block.firstChild) block.removeChild(block.firstChild);
      });
      return;
    }
    const genericContent = response.data.genericCfList.items[0];
    if (!genericContent || !genericContent.description || !genericContent.description.plaintext) {
      document.querySelectorAll('[data-genericContent-slug="' + slug + '"]').forEach(block => {
        while (block.firstChild) block.removeChild(block.firstChild);
      });
      return;
    }
    const backgroundImage = genericContent.primaryImage && genericContent.primaryImage._path ? genericContent.primaryImage._path : null;
    const genericContentTitle = genericContent.title || '';
    const genericContentDesc = genericContent.description.plaintext;

    // Create the HTML structure
    const html = `
      <div class="generic-cf-wrapper">
        <div class="text">
          <p>${genericContentDesc}</p>
        </div>
      </div>
    `;

    // Find all blocks with this slug and render
    document.querySelectorAll('[data-genericContent-slug="' + slug + '"]').forEach(block => {
      // Remove all children
      while (block.firstChild) block.removeChild(block.firstChild);
      // Insert the HTML
      block.innerHTML = html;
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.querySelectorAll('[data-genericContent-slug="' + slug + '"]').forEach(block => {
      block.innerHTML = '<p>Error loading content fragment</p>';
    });
  });
}





