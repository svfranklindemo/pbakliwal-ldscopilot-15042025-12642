// put your AEM publish address here
// this fixes having to manually change the AEM host here
const AEM_HOST = checkDomain()

function checkDomain(){
    return "https://publish-p121371-e1189853.adobeaemcloud.com/"    
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

const backgroundImage = response.data.adventureList.items[0].primaryImage._path;
document.getElementById(adventureDiv.id).innerHTML = "<section><img src=" + AEM_HOST + backgroundImage + "></section>";  

const adventureTitle = response.data.adventureList.items[0].title;
document.getElementById(adventureDiv.id).innerHTML += "<section><h3>"+ adventureTitle + "</h3></section>";

const adventureDesc = response.data.adventureList.items[0].description.plaintext;
document.getElementById(adventureDiv.id).innerHTML += "<section>" + adventureDesc + "</section>";

})
.catch(error => {
  console.log('Error fetching data:', error);
});

}





