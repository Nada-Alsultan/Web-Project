// to define the stars rate of the salon

document.querySelectorAll('[id^="star-"]').forEach(star => {
    star.addEventListener('click', function () {
        let rating = this.getAttribute('data-value');
        const salonDetailContainer = document.querySelector(".salon-detail-container");
        if (!salonDetailContainer) return;
        const salonId = salonDetailContainer.getAttribute("data-salon-id");


        fetch('/rate-salon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salonId, rating: Number(rating) })
        }).then(response => response.json())
            .then(data => {
                document.getElementById('rating-result').innerText = data.message;
                updateStars(rating);
            });
    });
});

function updateStars(rating) {
    const stars = document.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('checked');
        } else {
            star.classList.remove('checked');
        }
    });
}
