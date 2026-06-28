import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useToast } from '../context/ToastContext';

const EventForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    eventDate: '',
    status: 'DRAFT',
    imageUrl: '',
    minPrice: 0,
    availableSeats: 0,
    isHighDemand: false,
    venueId: ''
  });

  // Venue Modal state
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    city: '',
    capacity: 100
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const venueList = await eventService.getVenues();
        setVenues(venueList);
        if (venueList.length > 0 && !formData.venueId) {
          setFormData(prev => ({ ...prev, venueId: venueList[0].id.toString() }));
        }
      } catch (err) {
        showToast('Failed to fetch venues.', 'error');
      }
    };

    const loadEvent = async () => {
      if (isEditMode) {
        try {
          const event = await eventService.getEventById(id);
          // Convert date to datetime-local compatible string (YYYY-MM-DDThh:mm)
          const formattedDate = event.eventDate ? event.eventDate.substring(0, 16) : '';
          
          setFormData({
            title: event.title || '',
            category: event.category || '',
            description: event.description || '',
            eventDate: formattedDate,
            status: event.status || 'DRAFT',
            imageUrl: event.imageUrl || '',
            minPrice: event.minPrice || 0,
            availableSeats: event.availableSeats || 0,
            isHighDemand: !!event.isHighDemand,
            venueId: event.venue?.id ? event.venue.id.toString() : ''
          });
        } catch (err) {
          showToast('Failed to fetch event data.', 'error');
        }
      }
    };

    loadVenues().then(() => loadEvent());
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVenueChange = (e) => {
    setNewVenue(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
    }));
  };

  const handleCreateVenueSubmit = async (e) => {
    e.preventDefault();
    if (!newVenue.name || !newVenue.address || !newVenue.city) {
      showToast('Please fill all venue details.', 'error');
      return;
    }

    try {
      const created = await eventService.createVenue(newVenue);
      showToast('Venue created successfully!', 'success');
      setVenues(prev => [...prev, created]);
      setFormData(prev => ({ ...prev, venueId: created.id.toString() }));
      setIsVenueModalOpen(false);
      setNewVenue({ name: '', address: '', city: '', capacity: 100 });
    } catch (err) {
      showToast('Failed to create venue.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.eventDate || !formData.venueId) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    // Prepare payload
    const selectedVenue = venues.find(v => v.id.toString() === formData.venueId);
    
    // Format LocalDateTime string to match Spring Boot's expectations (e.g. YYYY-MM-DDThh:mm:ss)
    const formattedEventDate = formData.eventDate.length === 16 ? `${formData.eventDate}:00` : formData.eventDate;

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      eventDate: formattedEventDate,
      status: formData.status,
      imageUrl: formData.imageUrl,
      minPrice: parseFloat(formData.minPrice) || 0,
      availableSeats: parseInt(formData.availableSeats) || 0,
      isHighDemand: formData.isHighDemand,
      venue: {
        id: selectedVenue.id,
        name: selectedVenue.name,
        city: selectedVenue.city
      }
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await eventService.updateEvent(id, payload);
        showToast('Event updated successfully!', 'success');
      } else {
        await eventService.createEvent(payload);
        showToast('Event created successfully!', 'success');
      }
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            {isEditMode ? 'Edit Event Listing' : 'Create Event Listing'}
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {isEditMode ? 'Modify event metadata, timings, and visual assets.' : 'Establish a new event catalog entry and assign a venue.'}
          </p>
        </div>
        <button className="btn-outline" onClick={() => navigate('/')}>
          Back
        </button>
      </div>

      {/* Form Container */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Inception Live Concert"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                className="form-control"
                placeholder="e.g. Concert, Movie, Play"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Event Date & Time *</label>
              <input
                type="datetime-local"
                name="eventDate"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe the event, special instructions, and timings..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label>Min Price (₹) *</label>
              <input
                type="number"
                name="minPrice"
                className="form-control"
                value={formData.minPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Available Seats *</label>
              <input
                type="number"
                name="availableSeats"
                className="form-control"
                value={formData.availableSeats}
                onChange={handleChange}
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              placeholder="https://example.com/banner.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Venue Selection with quick-create */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label>Venue Assignment *</label>
              <button 
                type="button" 
                className="btn-outline" 
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'var(--secondary)' }}
                onClick={() => setIsVenueModalOpen(true)}
              >
                + Create New Venue
              </button>
            </div>

            {venues.length === 0 ? (
              <div style={{ color: '#f87171', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                No venues found. Please create a venue first using the button above.
              </div>
            ) : (
              <select
                name="venueId"
                className="form-control"
                value={formData.venueId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city}) - Cap: {v.capacity}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <div className="form-group">
              <label>Event Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <label className="checkbox-group" style={{ marginTop: '1.5rem' }}>
              <input
                type="checkbox"
                name="isHighDemand"
                checked={formData.isHighDemand}
                onChange={handleChange}
                disabled={loading}
              />
              <span>High Demand Event (Enables Waiting Queue)</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '1.5rem' }}
            disabled={loading || venues.length === 0}
          >
            {loading ? 'Saving Event...' : isEditMode ? 'Update Event Listing' : 'Publish Event Listing'}
          </button>
        </form>
      </div>

      {/* Create Venue Modal */}
      {isVenueModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setIsVenueModalOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create New Venue</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Add a new stadium, theater, or concert hall location configuration.
            </p>

            <form onSubmit={handleCreateVenueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Venue Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Wembley Stadium"
                  value={newVenue.name}
                  onChange={handleVenueChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="e.g. Wembley, London HA9 0WS"
                  value={newVenue.address}
                  onChange={handleVenueChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="e.g. Chennai"
                    value={newVenue.city}
                    onChange={handleVenueChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    className="form-control"
                    value={newVenue.capacity}
                    onChange={handleVenueChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '1rem' }}
              >
                Create Venue
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventForm;
