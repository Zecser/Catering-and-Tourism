// src/features/admin-reviews/components/AdminReviews.tsx
import React from "react";
import Swal from "sweetalert2";
import { useReviews } from "../hooks/useReviews";

// Skeleton Loader Component
const ReviewSkeleton = () => (
  <div className="review-card skeleton-card">
    <div className="review-header">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-rating"></div>
    </div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text short"></div>
    <div className="skeleton skeleton-badge"></div>
    <div className="skeleton skeleton-meta"></div>
    <div className="review-actions">
      <div className="skeleton skeleton-button"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  </div>
);

const FormSkeleton = () => (
  <div className="review-form skeleton-form">
    <div className="skeleton skeleton-heading"></div>
    <div className="form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-input"></div>
    </div>
    <div className="form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-input"></div>
    </div>
    <div className="form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-textarea"></div>
    </div>
    <div className="skeleton skeleton-checkbox"></div>
    <div className="form-actions">
      <div className="skeleton skeleton-button"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  </div>
);

const AdminReviews: React.FC = () => {
  const { 
    reviews, 
    loading, 
    error, 
    form, 
    setForm, 
    save, 
    remove, 
    edit, 
    resetForm 
  } = useReviews();

  // Enhanced save function with SweetAlert
  const handleSave = async () => {
    try {
      // Basic client-side validation before API call
      if (!form.name || form.name.trim().length < 2) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Name must be at least 2 characters long.',
          icon: 'warning',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      if (!form.comment || form.comment.trim().length < 10) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Comment must be at least 10 characters long.',
          icon: 'warning',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      if (!form.rating || form.rating < 1 || form.rating > 5) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Rating must be between 1 and 5.',
          icon: 'warning',
          confirmButtonColor: '#ffc107'
        });
        return;
      }

      await save();
      
      // Success alert
      Swal.fire({
        title: 'Success!',
        text: form._id ? 'Review updated successfully!' : 'Review added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true
      });
    } catch (err: any) {
      console.error('Save error:', err);
      
      // Enhanced error handling
      let errorMessage = 'Failed to save review. Please try again.';
      
      if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.join(', ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  // Enhanced delete function with confirmation
  const handleDelete = async (reviewId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover this review!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await remove(reviewId);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Review has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (err: any) {
        Swal.fire({
          title: 'Error!',
          text: err.message || 'Failed to delete review. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  // Enhanced edit function with notification
  const handleEdit = (review: any) => {
    edit(review);
    
    Swal.fire({
      title: 'Edit Mode',
      text: `Now editing review by ${review.name}`,
      icon: 'info',
      confirmButtonColor: '#007bff',
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false
    });
  };

  // Enhanced cancel function with confirmation if form has data
  const handleCancel = () => {
    const hasFormData = form.name || form.comment || form.rating !== 5;
    
    if (hasFormData) {
      Swal.fire({
        title: 'Discard changes?',
        text: "Any unsaved changes will be lost.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#007bff',
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'Continue editing'
      }).then((result) => {
        if (result.isConfirmed) {
          resetForm();
          Swal.fire({
            title: 'Cancelled',
            text: 'Changes discarded',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
        }
      });
    } else {
      resetForm();
    }
  };

  // Show error alert when error occurs
  React.useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Loading Error',
        text: error,
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    }
  }, [error]);

  // Show skeleton loader while loading
  if (loading) {
    return (
      <div className="admin-reviews">
        <h1>Admin Reviews Management</h1>
        <FormSkeleton />
        <div className="reviews-list">
          <div className="skeleton skeleton-heading" style={{ width: '200px', marginBottom: '20px' }}></div>
          <div className="reviews-grid">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        </div>
        {renderStyles()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reviews">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
        {renderStyles()}
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <h1>Admin Reviews Management</h1>
      
      {/* Form for adding/editing reviews */}
      <div className="review-form">
        <h2>{form._id ? "Edit Review" : "Add Review"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="form-group">
            <label>Rating:</label>
            <select
              value={form.rating || 5}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
              required
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Review Comment:</label>
            <textarea
              value={form.comment || ""}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              rows={4}
              placeholder="Enter review comment (minimum 10 characters)"
            />
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.isPublished || false}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Published
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : form._id ? "Update Review" : "Add Review"}
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Reviews list */}
      <div className="reviews-list">
        <h2>All Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="empty-icon">📝</div>
            <p>No reviews found.</p>
            <button 
              className="btn-primary"
              onClick={() => {
                Swal.fire({
                  title: 'Get Started!',
                  text: 'Start by adding your first review using the form above.',
                  icon: 'info',
                  confirmButtonColor: '#007bff'
                });
              }}
            >
              Add Your First Review
            </button>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <h3>{review.name || "Anonymous"}</h3>
                  <div className="rating">
                    <span className="stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    <span className="rating-text">({review.rating}/5)</span>
                  </div>
                </div>
                
                <p className="review-text">{review.comment}</p>
                
                <div className="status">
                  <span className={`status-badge ${review.isPublished ? 'published' : 'unpublished'}`}>
                    {review.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </div>
                
                <div className="review-meta">
                  <small>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "No date"}
                  </small>
                </div>
                
                <div className="review-actions">
                  <button 
                    onClick={() => handleEdit(review)}
                    className="btn-edit"
                    title="Edit this review"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(review._id!)}
                    className="btn-delete"
                    title="Delete this review"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {renderStyles()}
    </div>
  );
};

// Extracted styles function for reusability
const renderStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .admin-reviews {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      
      .admin-reviews h1 {
        color: #333;
        margin-bottom: 30px;
        text-align: center;
        font-size: 32px;
        font-weight: 700;
      }
      
      /* Skeleton Loader Styles */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s ease-in-out infinite;
        border-radius: 4px;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .skeleton-card {
        opacity: 0.7;
      }
      
      .skeleton-title {
        height: 24px;
        width: 60%;
        margin-bottom: 10px;
      }
      
      .skeleton-rating {
        height: 20px;
        width: 80px;
      }
      
      .skeleton-text {
        height: 16px;
        width: 100%;
        margin-bottom: 8px;
      }
      
      .skeleton-text.short {
        width: 70%;
      }
      
      .skeleton-badge {
        height: 24px;
        width: 100px;
        margin: 15px 0;
      }
      
      .skeleton-meta {
        height: 14px;
        width: 120px;
        margin: 15px 0;
      }
      
      .skeleton-button {
        height: 36px;
        width: 80px;
        border-radius: 4px;
      }
      
      .skeleton-heading {
        height: 28px;
        width: 250px;
        margin-bottom: 20px;
      }
      
      .skeleton-label {
        height: 18px;
        width: 120px;
        margin-bottom: 8px;
      }
      
      .skeleton-input {
        height: 40px;
        width: 100%;
      }
      
      .skeleton-textarea {
        height: 100px;
        width: 100%;
      }
      
      .skeleton-checkbox {
        height: 20px;
        width: 150px;
        margin: 15px 0;
      }
      
      .skeleton-form {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        margin-bottom: 40px;
      }
      
      /* Error Container Styles */
      .error-container {
        text-align: center;
        padding: 60px 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-top: 40px;
      }
      
      .error-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }
      
      .error-container h2 {
        color: #dc3545;
        margin-bottom: 15px;
        font-size: 24px;
        font-weight: 600;
      }
      
      .error-message {
        color: #6c757d;
        margin-bottom: 25px;
        font-size: 16px;
      }
      
      .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      
      .review-form {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 8px;
        margin-bottom: 40px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .review-form h2 {
        margin-top: 0;
        margin-bottom: 20px;
        color: #495057;
        font-size: 24px;
        font-weight: 600;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #495057;
      }
      
      .form-group label input[type="checkbox"] {
        width: auto;
        margin-right: 8px;
        margin-bottom: 0;
      }
      
      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        box-sizing: border-box;
      }
      
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
      }
      
      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: #6c757d;
        opacity: 0.8;
      }
      
      .form-group textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      .form-actions {
        display: flex;
        gap: 10px;
      }
      
      .btn-primary, .btn-secondary, .btn-edit, .btn-delete {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.15s ease-in-out;
      }
      
      .btn-primary {
        background-color: #007bff;
        color: white;
      }
      
      .btn-primary:hover:not(:disabled) {
        background-color: #0056b3;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,123,255,0.3);
      }
      
      .btn-primary:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      
      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }
      
      .btn-secondary:hover {
        background-color: #545b62;
        transform: translateY(-1px);
      }
      
      .reviews-list h2 {
        color: #495057;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: 600;
      }
      
      .no-reviews {
        text-align: center;
        padding: 40px;
        color: #6c757d;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .no-reviews button {
        margin-top: 15px;
      }
      
      .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }
      
      .review-card {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }
      
      .review-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
      
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
      }
      
      .review-header h3 {
        margin: 0;
        color: #333;
        font-size: 20px;
        font-weight: 600;
      }
      
      .rating {
        text-align: right;
        flex-shrink: 0;
      }
      
      .stars {
        color: #ffc107;
        font-size: 16px;
        display: block;
      }
      
      .rating-text {
        font-size: 12px;
        color: #6c757d;
      }
      
      .review-text {
        color: #555;
        line-height: 1.6;
        margin-bottom: 15px;
      }
      
      .status {
        margin-bottom: 15px;
      }
      
      .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
      
      .status-badge.published {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      
      .status-badge.unpublished {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
      
      .review-meta {
        border-top: 1px solid #e9ecef;
        padding-top: 15px;
        margin-top: 15px;
        margin-bottom: 15px;
      }
      
      .review-meta small {
        color: #6c757d;
      }
      
      .review-actions {
        display: flex;
        gap: 8px;
      }
      
      .btn-edit {
        background-color: #28a745;
        color: white;
        padding: 8px 16px;
        font-size: 13px;
      }
      
      .btn-edit:hover {
        background-color: #218838;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(40,167,69,0.3);
      }
      
      .btn-delete {
        background-color: #dc3545;
        color: white;
        padding: 8px 16px;
        font-size: 13px;
      }
      
      .btn-delete:hover {
        background-color: #c82333;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(220,53,69,0.3);
      }
      
      @media (max-width: 768px) {
        .admin-reviews {
          padding: 15px;
        }
        
        .reviews-grid {
          grid-template-columns: 1fr;
        }
        
        .form-actions {
          flex-direction: column;
        }
        
        .review-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .rating {
          text-align: left;
          margin-top: 5px;
        }
      }

      /* SweetAlert2 custom styles */
      .swal2-popup {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      
      .swal2-title {
        color: #333 !important;
      }
      
      .swal2-content {
        color: #555 !important;
      }
    `
  }} />
);

export default AdminReviews;