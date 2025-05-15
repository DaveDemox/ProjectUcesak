import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import './App.css';

function Dashboard({ onCreate }) {
  const [lengthOptions, setLengthOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [hairstyles, setHairstyles] = useState([]);

  // Fetch picker options on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [lengthRes, shapeRes] = await Promise.all([
          fetch("http://localhost:3004/api/hairstyles/length-categories"),
          fetch("http://localhost:3004/api/hairstyles/faceshape-categories")
        ]);

        if (!lengthRes.ok || !shapeRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const lengthData = await lengthRes.json();
        const shapeData = await shapeRes.json();

        setLengthOptions(Array.isArray(lengthData) ? lengthData : []);
        setShapeOptions(Array.isArray(shapeData) ? shapeData : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLengthOptions([]);
        setShapeOptions([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch hairstyles when filters change
  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        let url = "http://localhost:3004/api/hairstyles";
        const params = [];
        if (selectedLength) params.push(`lengthCategoryId=${selectedLength}`);
        if (selectedShape) params.push(`faceShapeCategoryId=${selectedShape}`);
        if (params.length) url += "?" + params.join("&");

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch hairstyles');
        }

        const data = await response.json();
        setHairstyles(Array.isArray(data.itemList) ? data.itemList : []);
      } catch (error) {
        console.error('Error fetching hairstyles:', error);
        setHairstyles([]);
      }
    };

    fetchHairstyles();
  }, [selectedLength, selectedShape]);

  const navigate = useNavigate();

  // Add like/dislike handler
  const handleLike = async (id, isLiked) => {
    try {
      const response = await fetch(`http://localhost:3004/api/hairstyles/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked })
      });
      if (!response.ok) throw new Error('Failed to update like');
      const updated = await response.json();
      setHairstyles(prev => prev.map(h => h.id === id ? { ...h, isLiked: updated.isLiked } : h));
    } catch (e) {
      alert('Error updating like: ' + e.message);
    }
  };

  // Remove duplicates from options
  const uniqueLengthOptions = Array.from(new Map(lengthOptions.map(opt => [opt.id, opt])).values());
  const uniqueShapeOptions = Array.from(new Map(shapeOptions.map(opt => [opt.id, opt])).values());

  // Random filter handler
  const handleRandom = () => {
    if (lengthOptions.length > 0) {
      const randomLength = lengthOptions[Math.floor(Math.random() * lengthOptions.length)].id;
      setSelectedLength(randomLength);
    }
    if (shapeOptions.length > 0) {
      const randomShape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)].id;
      setSelectedShape(randomShape);
    }
  };

  // Sort hairstyles: liked/unrated first, disliked last
  const sortedHairstyles = [
    ...hairstyles.filter(h => h.isLiked !== false),
    ...hairstyles.filter(h => h.isLiked === false)
  ];

  return (
    <div className="container min-vh-100 py-3 d-flex flex-column align-items-center justify-content-center" style={{ position: 'relative', padding: 0 }}>
      <div className="fixed-top-bar">
        <div className="filter-row">
          <div className="filter-col">
            <label htmlFor="length-picker" className="form-label-lg">Length</label>
            <select
              id="length-picker"
              name="length"
              className="form-select"
              value={selectedLength}
              onChange={e => setSelectedLength(e.target.value)}
            >
              <option value="">Length</option>
              {uniqueLengthOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-col">
            <label htmlFor="shape-picker" className="form-label-lg">Face shape</label>
            <select
              id="shape-picker"
              name="shape"
              className="form-select"
              value={selectedShape}
              onChange={e => setSelectedShape(e.target.value)}
            >
              <option value="">Shape</option>
              {uniqueShapeOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="dashboard-mobile">
        <div style={{ flex: 1, width: '100%' }}>
          <div className="row flex-grow-1 align-items-center justify-content-center" style={{ marginTop: 24, marginBottom: 24 }}>
            {sortedHairstyles.length === 0 && (
              <span className="text-muted">No haircuts found</span>
            )}
            {sortedHairstyles.map((h) => (
              <div className="col-12 mb-4 d-flex justify-content-center" key={h.id}>
                <div className="card text-center">
                  <div className="card-body">
                    <div className="card-image-rect">
                      {h.imageUrl ? (
                        <img src={`http://localhost:3004${h.imageUrl}`} alt={h.name} />
                      ) : (
                        <span style={{ fontSize: '8vw', color: "#bbb" }}>&#128100;</span>
                      )}
                    </div>
                    <h5 className="card-title" style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>{h.name}</h5>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
                      <button
                        className={`btn btn-lg ${h.isLiked === true ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleLike(h.id, true)}
                        type="button"
                        disabled={h.isLiked === true}
                        style={{ fontSize: '1.2rem', minWidth: 100 }}
                      >
                        Like
                      </button>
                      <button
                        className={`btn btn-lg ${h.isLiked === false ? 'btn-danger' : 'btn-outline-secondary'}`}
                        onClick={() => handleLike(h.id, false)}
                        type="button"
                        disabled={h.isLiked === false}
                        style={{ fontSize: '1.2rem', minWidth: 100 }}
                      >
                        Dislike
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed-bottom-bar">
        <div className="dashboard-buttons" style={{ width: '100%', maxWidth: 480 }}>
          <button className="btn btn-outline-primary" onClick={handleRandom}>Random</button>
          <button className="btn btn-outline-success" onClick={() => navigate('/create')}>Create</button>
        </div>
      </div>
    </div>
  );
}

function CreateHairstyle() {
  const [lengthOptions, setLengthOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lengthCategoryId: '',
    faceShapeCategoryId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [lengthRes, shapeRes] = await Promise.all([
          fetch("http://localhost:3004/api/hairstyles/length-categories"),
          fetch("http://localhost:3004/api/hairstyles/faceshape-categories")
        ]);

        if (!lengthRes.ok || !shapeRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const lengthData = await lengthRes.json();
        const shapeData = await shapeRes.json();

        setLengthOptions(Array.isArray(lengthData) ? lengthData : []);
        setShapeOptions(Array.isArray(shapeData) ? shapeData : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLengthOptions([]);
        setShapeOptions([]);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.lengthCategoryId || !formData.faceShapeCategoryId) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('lengthCategoryId', formData.lengthCategoryId);
      form.append('faceShapeCategoryId', formData.faceShapeCategoryId);
      if (imageFile) {
        form.append('image', imageFile);
      }
      const response = await fetch('http://localhost:3004/api/hairstyles', {
        method: 'POST',
        body: form
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create hairstyle');
      }
      // Navigate back to dashboard on success
      navigate('/');
    } catch (error) {
      alert('Error creating hairstyle: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deduplicate options for CreateHairstyle
  const uniqueLengthOptions = Array.from(new Map(lengthOptions.map(opt => [opt.id, opt])).values());
  const uniqueShapeOptions = Array.from(new Map(shapeOptions.map(opt => [opt.id, opt])).values());

  return (
    <div className="container min-vh-100 py-3 d-flex align-items-center justify-content-center" style={{ position: 'relative', padding: 0 }}>
      <form onSubmit={handleSubmit} className="form-mobile" style={{ paddingBottom: 80 }}>
        <div className="form-group">
          <label htmlFor="name" className="form-label-lg">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lengthCategoryId" className="form-label-lg">Length</label>
          <select 
            className="form-select" 
            id="lengthCategoryId" 
            name="lengthCategoryId"
            value={formData.lengthCategoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select length</option>
            {uniqueLengthOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="faceShapeCategoryId" className="form-label-lg">Face shape</label>
          <select 
            className="form-select" 
            id="faceShapeCategoryId" 
            name="faceShapeCategoryId"
            value={formData.faceShapeCategoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select face shape</option>
            {uniqueShapeOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label-lg">Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/png"
            onChange={handleImageChange}
          />
          <div className="image-preview">
            <span>Image</span>
          </div>
        </div>
      </form>
      <div className="fixed-bottom-bar">
        <div className="button-row" style={{ width: '100%', maxWidth: 400 }}>
          <button 
            type="submit" 
            className="btn btn-outline-success"
            form="create-hairstyle-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateHairstyle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
