const ReviewService = {
    init: function() {
        console.log('ReviewService.init() called');
        
        const reviewsList = document.getElementById('reviewsList');
        const reviewForm = document.getElementById('reviewForm');
        
        if (!reviewsList) {
            console.error('reviewsList element not found!');
            return;
        }
        
        if (!reviewForm) {
            console.error('reviewForm element not found!');
            return;
        }
        
        console.log('Elements found, starting load and setup...');
        this.loadReviews();
        this.setupForm();
    },

    loadReviews: function() {
        const reviewsList = document.getElementById('reviewsList');
        
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "reviews",
            type: "GET",
            dataType: "json",
            success: function(res) {
                console.log('Reviews received:', res);
                const reviews = Array.isArray(res) ? res : [];
                
                reviewsList.innerHTML = ''; 
                
                if (reviews.length === 0) {
                    reviewsList.innerHTML = '<p class="text-center text-muted">No reviews yet.</p>';
                    return;
                }
                
                reviews.forEach(function(review) {
                    const div = document.createElement('div');
                    div.className = 'card review-card p-4 mb-3';
                    div.innerHTML = `
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5>${review.user_name || review.username || 'User #' + review.user_id}</h5>
                                <p class="text-muted mb-1">Book: ${review.book_title || review.book_name || 'Book #' + review.book_id}</p>
                            </div>
                            <div class="review-rating-display">
                                <span>${'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</span>
                            </div>
                        </div>
                        <p class="mt-3">${review.review_text || review.text}</p>
                        <small class="text-muted">${new Date(review.created_at).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</small>
                    `;
                    reviewsList.prepend(div);
                });
            },
            error: function(err) { 
                console.error("Error fetching reviews:", err);
                reviewsList.innerHTML = '<p class="text-center text-danger">Error loading reviews.</p>';
            }
        });
    },

    setupForm: function() {
        const reviewForm = document.getElementById('reviewForm');
        
        reviewForm.addEventListener('submit', function(e){
            e.preventDefault();
            
            const rating = document.querySelector('input[name="rating"]:checked');
            if (!rating) {
                alert('Please select a rating!');
                return;
            }
            
            const data = {
                user_id: 1, 
                book_id: 1, 
                rating: parseInt(rating.value),
                text: document.getElementById('reviewText').value
            };
            
            $.ajax({
                url: Constants.PROJECT_BASE_URL + "reviews",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(newReview){
                    ReviewService.loadReviews(); 
                    reviewForm.reset();
                    alert('Review submitted successfully!');
                },
                error: function(err){ 
                    console.error("Error submitting review:", err);
                    const errorMsg = err.responseJSON?.message || 'Error submitting review!';
                    alert(errorMsg);
                }
            });
        });
    }
};