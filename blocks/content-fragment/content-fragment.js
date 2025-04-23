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
  
  // Create the main adventure div
  const quoteDiv = block.querySelector('div:last-of-type');
  const adventureDiv = document.createElement('div');
  adventureDiv.id = "adventure-" + slug; 
  quoteDiv.replaceWith(adventureDiv);

  // Fetch the adventure data
  fetch(AEM_HOST + '/graphql/execute.json/aem-demo-assets/adventure-by-slug;slug=' + slug, {
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
    const adventure = response.data.adventureList.items[0];
    const backgroundImage = adventure.primaryImage._path;
    const adventureTitle = adventure.title;
    const adventureDesc = adventure.description.plaintext;

    // Create the HTML structure
    const html = `
      <div class="cf-wrapper">
        <div class="image">
          <img src="${AEM_HOST}${backgroundImage}" alt="${adventureTitle}">
        </div>
        <div class="text">
          <h3>${adventureTitle}</h3>
          <p>${adventureDesc}</p>
        </div>
      </div>
    `;

    // Set the HTML content
    document.getElementById(adventureDiv.id).innerHTML = html;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById(adventureDiv.id).innerHTML = '<p>Error loading content fragment</p>';
  });
}





