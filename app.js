const container = document.getElementsByClassName("listings")[0];
const pageLabel = document.getElementById("page-count");

let allListings = [];
let currentPage = 1;
const itemsPerPage = 6;

async function init() {
  try {
    const response = await fetch("airbnb_sf_listings_500.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    allListings = await response.json();

    allListings = allListings.slice(0, 50);

    renderPage(1);
  } catch (error) {
    console.error("Error loading data:", error);
    container.innerHTML = "<p>Error loading data.</p>";
  }
}

function renderPage(page) {
  if (page < 1) page = 1;
  const totalPages = Math.ceil(allListings.length / itemsPerPage);
  if (page > totalPages) page = totalPages;

  currentPage = page;
  pageLabel.innerText = `Page ${currentPage} of ${totalPages}`;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageListings = allListings.slice(start, end);

  container.innerHTML = "";

  window.scrollTo(0, 0);

  pageListings.forEach((listing) => {
    const article = document.createElement("article");
    article.className = "listing";

    let amenitiesHtml = "";
    try {
      amenitiesHtml = JSON.parse(listing.amenities)
        .map((amenity) => `<span class="amenity">${amenity}</span>`)
        .join(" ");
    } catch (e) {
      amenitiesHtml = "<span>No amenities listed</span>";
    }

    article.innerHTML = `
        <h2>${listing.name}</h2>
        <div class="details">
            <div class="host">
                <img class="host-picture" src="${listing.host_picture_url}" onerror="this.onerror=null; this.src='https://placehold.co/50x50?text=Host';" alt="${listing.host_name}">
                <p>${listing.host_name}</p>
            </div>
            <div class="price-rating">
                <div class="price">${listing.price}</div>
                <div class="rating">⭐${listing.review_scores_rating || "N/A"}</div>
            </div>
        </div>
        <div class="review-scores">
                    <p>Accuracy: ${listing.review_scores_accuracy || "N/A"}</p>
                    <p>Cleanliness: ${listing.review_scores_cleanliness || "N/A"}</p>
                    <p>Check-in: ${listing.review_scores_checkin || "N/A"}</p>
                    <p>Communication: ${listing.review_scores_communication || "N/A"}</p>
                    <p>Location: ${listing.review_scores_location || "N/A"}</p>
                    <p>Value: ${listing.review_scores_value || "N/A"}</p>
        </div>
        <img class="listing-picture" src="${listing.picture_url}" onerror="this.onerror=null; this.src='https://placehold.co/300x200?text=No+Image';" alt="${listing.name}">
        <div class="description">${listing.description ? listing.description : "No description"}</div>
        <div class="amenities">
        <h2>Amenities</h2>
            <div>
            ${amenitiesHtml}
            </div>
        </div>
    `;
    container.appendChild(article);
  });

  document.getElementById("btn-prev").disabled = currentPage === 1;
  document.getElementById("btn-next").disabled = currentPage === totalPages;
}

function changePage(direction) {
  renderPage(currentPage + direction);
}

init();
