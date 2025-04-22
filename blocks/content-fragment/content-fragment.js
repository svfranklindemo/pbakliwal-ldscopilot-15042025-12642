// put your AEM publish address here
// this fixes having to manually change the AEM host here
const AEM_HOST = checkDomain()

function checkDomain(){
  if (window.location.hostname.includes("aem.page") || window.location.hostname.includes("localhost") || window.location.hostname.includes("aem.live")){
    return "https://publish-p121371-e1189853.adobeaemcloud.com"    
  }else{
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


fetch(AEM_HOST + '/graphql/execute.json/aem-demo-assets/adventure-by-slug;slug=' + slug, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': window.location.origin
  },
  credentials: 'include' // This is needed if the AEM server requires authentication
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok: ' + response.status);
  }
  return response.json();
})
.then(response => {

const backgroundImage = response.data.adventureList.items[0].primaryImage._path;
if(backgroundImage){
document.getElementById(adventureDiv.id).innerHTML = "<section><img src=" + AEM_HOST + backgroundImage + "></section>";  
}

const adventureTitle = response.data.adventureList.items[0].title;
if(adventureTitle){
document.getElementById(adventureDiv.id).innerHTML += "<section><h3>"+ adventureTitle + "</h3></section>";
}

const adventureDesc = response.data.adventureList.items[0].description.plaintext;
if(adventureDesc){
document.getElementById(adventureDiv.id).innerHTML += "<section>" + adventureDesc + "</section>";
}

const adventureType = response.data.adventureList.items[0].adventureType;
if(adventureType){
document.getElementById(adventureDiv.id).innerHTML += "<section>" + "Adventure Type: " + adventureType + "</section>";
}

const tripLength = response.data.adventureList.items[0].tripLength;
if(tripLength){
document.getElementById(adventureDiv.id).innerHTML += "<section>" +"Trip Length: " + tripLength + "</section>";
}

const tripDifficulty = response.data.adventureList.items[0].difficulty;
if(tripDifficulty){
document.getElementById(adventureDiv.id).innerHTML += "<section>" + "Difficulty: " + tripDifficulty + "</section>";
}

const groupSize = response.data.adventureList.items[0].groupSize;
if(groupSize){
document.getElementById(adventureDiv.id).innerHTML += "<section>" + "Group Size: " + groupSize + "</section>";
}

const tripItinerary= response.data.adventureList.items[0].itinerary.html;
if(tripItinerary){
document.getElementById(adventureDiv.id).innerHTML += "<section>" + "Itinerary: </br>" + tripItinerary + "</section>";
}

})
.catch(error => {
  console.log('Error fetching data:', error);
});

}





