function showDetails(salonName) {
    alert("More details about " + salonName);
}

document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const salonCards = document.querySelectorAll('.salon-card');

    salonCards.forEach(card => {
        const salonName = card.getAttribute('data-name');
        const salonLocation = card.getAttribute('data-location');
        const locationElement = card.querySelector('.location');

        // Show location if the search term matches the location
        if (salonLocation.includes(searchTerm)) {
            locationElement.style.display = 'block';
        } else {
            locationElement.style.display = 'none';
        }

        // Show or hide the card based on whether the search term matches name or location
        if (salonName.includes(searchTerm) || salonLocation.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});