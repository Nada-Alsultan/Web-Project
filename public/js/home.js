
// to search by salon name or location name
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const salonCards = document.querySelectorAll('.salon-card');

    salonCards.forEach(card => {
        const salonName = card.getAttribute('data-name');
        const salonLocation = card.getAttribute('data-location');
        const locationElement = card.querySelector('.location');

        // Show or hide the card based on whether the search term matches name or location
        if (salonName.includes(searchTerm) || salonLocation.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});