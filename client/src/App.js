import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

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
        if (selectedShape) params.push(`faceshapeCategoryId=${selectedShape}`);
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

  return (
    <div className="container d-flex flex-column justify-content-between min-vh-100 py-3">
      {/* Top pickers */}
      <div className="row mb-4">
        <div className="col-6">
          <select
            id="length-picker"
            name="length"
            className="form-select"
            value={selectedLength}
            onChange={e => setSelectedLength(e.target.value)}
          >
            <option value="">Length</option>
            {lengthOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <select
            id="shape-picker"
            name="shape"
            className="form-select"
            value={selectedShape}
            onChange={e => setSelectedShape(e.target.value)}
          >
            <option value="">Shape</option>
            {shapeOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Haircuts grid */}
      <div className="row flex-grow-1 align-items-center justify-content-center">
        {hairstyles.length === 0 && (
          <span className="text-muted">No haircuts found</span>
        )}
        {hairstyles.map((h) => (
          <div className="col-6 mb-4 d-flex justify-content-center" key={h.id}>
            <div className="card text-center" style={{ width: "90%" }}>
              <div className="card-body">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    border: "2px solid #333",
                    borderRadius: "50%",
                    margin: "0 auto 10px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 40, color: "#bbb" }}>&#128100;</span>
                </div>
                <h5 className="card-title">{h.name}</h5>
                <div className="d-flex justify-content-center gap-2 mb-2">
                  <button className="btn btn-outline-success btn-sm">Like</button>
                  <button className="btn btn-outline-danger btn-sm">Dislike</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="row mt-4">
        <div className="col-6 d-grid">
          <button className="btn btn-outline-primary">Random</button>
        </div>
        <div className="col-6 d-grid">
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.lengthCategoryId || !formData.faceShapeCategoryId) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3004/api/hairstyles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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

  return (
    <div className="container d-flex flex-column min-vh-100 py-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold">Name</label>
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
        <div className="mb-3">
          <label htmlFor="lengthCategoryId" className="form-label fw-bold">Length</label>
          <select 
            className="form-select" 
            id="lengthCategoryId" 
            name="lengthCategoryId"
            value={formData.lengthCategoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select length</option>
            {lengthOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="faceShapeCategoryId" className="form-label fw-bold">Face shape</label>
          <select 
            className="form-select" 
            id="faceShapeCategoryId" 
            name="faceShapeCategoryId"
            value={formData.faceShapeCategoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select face shape</option>
            {shapeOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Image</label>
          <div style={{ width: 120, height: 120, border: '2px solid #333', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 40, color: '#bbb' }}>Image</span>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-6 d-grid">
            <button 
              type="submit" 
              className="btn btn-outline-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
          <div className="col-6 d-grid">
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
      </form>
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
