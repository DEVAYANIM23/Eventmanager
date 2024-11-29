import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { addEvent } from '../firebase/firestoreService';
import './CreateEvent.css'; // Import the CSS file

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'theater', name: 'Theater' },
  { id: 'sports', name: 'Sports' },
  { id: 'education', name: 'Education' },
  { id: 'social', name: 'Social' },
  { id: 'gaming', name: 'Gaming' },
];

function CreateEvent() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await addEvent({
        ...data,
        date: new Date(data.date),
        createdAt: new Date(),
      });

      alert('Event created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Create New Event</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="form-input"
            />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="form-textarea"
            />
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date</label>
              <div className="form-icon-container">
                <Calendar className="form-icon" />
                <input
                  {...register('date', { required: 'Date is required' })}
                  type="date"
                  className="form-input input-with-icon"
                />
              </div>
              {errors.date && <p className="error-message">{errors.date.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                {...register('time', { required: 'Time is required' })}
                type="time"
                className="form-input"
              />
              {errors.time && <p className="error-message">{errors.time.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <div className="form-icon-container">
              <MapPin className="form-icon" />
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="form-input input-with-icon"
              />
            </div>
            {errors.location && <p className="error-message">{errors.location.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="form-select"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-message">{errors.category.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              {...register('image', { required: 'Image URL is required' })}
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="error-message">{errors.image.message}</p>}
          </div>

          {/* New Field for Organizer Name */}
          <div className="form-group">
            <label className="form-label">Organizer Name</label>
            <input
              {...register('organizer', { required: 'Organizer name is required' })}
              type="text"
              className="form-input"
            />
            {errors.organizer && <p className="error-message">{errors.organizer.message}</p>}
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
