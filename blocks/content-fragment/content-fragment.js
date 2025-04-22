// put your AEM publish address here
// this fixes having to manually change the AEM host here
const AEM_HOST = checkDomain()

function checkDomain(){
  if (window.location.hostname.includes("aem.page") || window.location.hostname.includes("localhost") || window.location.hostname.includes("aem.live")){
    // Use proxy path for development
    return "https://publish-p121371-e1189853.adobeaemcloud.com";    
  } else {
    return window.location.origin 
  }
}

export default function decorate(block) {

  const slugDiv = block.querySelector('div:nth-child(1)'); 
  const slugID = document.createElement('div');
  slugID.id = 'slug';
  slugDiv.replaceWith(slugID);
  slugID.innerHTML = `${slugDiv.innerHTML}`;
  const slug = slugID.textContent.trim();
  
  const quoteDiv = block.querySelector('div:last-of-type');
  const adventureDiv = document.createElement('div');
  adventureDiv.id = "adventure-" + slug; 
  quoteDiv.replaceWith(adventureDiv);

  // Construct the full URL for the GraphQL endpoint
  const graphqlEndpoint = `${AEM_HOST}/graphql/execute.json/aem-demo-assets/adventure-by-slug;slug=${slug}`;
  
  // First try with credentials
  fetch(graphqlEndpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    credentials: 'include',
    mode: 'cors'
  })
  .then(response => {
    if (!response.ok) {
      // If first attempt fails, try without credentials
      return fetch(graphqlEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
      });
    }
    return response;
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }
    return response.json();
  })
  .then(response => {
    const adventure = response.data.adventureList.items[0];
    
    // Create the main container with wrapper
    let htmlContent = `
      <div class="content-fragment-wrapper">
        <!-- Image Section -->
        <section class="adventure-image">
          ${adventure.primaryImage?._path ? 
            `<img src="${AEM_HOST}${adventure.primaryImage._path}" alt="${adventure.title || 'Adventure Image'}" loading="lazy">` 
            : ''}
        </section>

        <!-- Content Container -->
        <div class="adventure-content">
          <!-- Title Section -->
          ${adventure.title ? 
            `<section class="adventure-title">
              <h3>${adventure.title}</h3>
            </section>` 
            : ''}

          <!-- Description Section -->
          ${adventure.description?.plaintext ? 
            `<section class="adventure-description">
              <p>${adventure.description.plaintext}</p>
            </section>` 
            : ''}

          <!-- Info Cards Container -->
          <div class="adventure-info-cards">
            ${adventure.adventureType ? 
              `<section class="info-card">
                <span class="info-value">${adventure.adventureType}</span>
              </section>` 
              : ''}
            
            ${adventure.tripLength ? 
              `<section class="info-card">
                <span class="info-value">${adventure.tripLength}</span>
              </section>` 
              : ''}
            
            ${adventure.difficulty ? 
              `<section class="info-card">
                <span class="info-value">${adventure.difficulty}</span>
              </section>` 
              : ''}
            
            ${adventure.groupSize ? 
              `<section class="info-card">
                <span class="info-value">${adventure.groupSize}</span>
              </section>` 
              : ''}
          </div>

          <!-- Itinerary Section -->
          ${adventure.itinerary?.html ? 
            `<section class="adventure-itinerary">
              <div class="itinerary-content">
                ${adventure.itinerary.html}
              </div>
            </section>` 
            : ''}
        </div>
      </div>
    `;

    // Set the content
    document.getElementById(adventureDiv.id).innerHTML = htmlContent;

    // Add animation classes with delay
    const sections = document.querySelectorAll(`#${adventureDiv.id} section`);
    sections.forEach((section, index) => {
      section.style.setProperty('--index', index);
      section.classList.add('animate-in');
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById(adventureDiv.id).innerHTML = `
      <div class="error-message">
        <h3>Unable to load content</h3>
        <p>Please try again later</p>
      </div>
    `;
  });
}





