import React, { useEffect, useState } from "react";

function App() {
  const [categoryMap, setCategoryMap] = useState({});
  const [lengthOptions, setLengthOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [hairstyles, setHairstyles] = useState([]);
  const [allHairstyles, setAllHairstyles] = useState([]);

  // Fetch all categories and hairstyles on mount
  useEffect(() => {
    fetch("/api/hairstyles")
      .then(res => res.json())
      .then(data => {
        setAllHairstyles(data.itemList || []);
        setCategoryMap(data.categoryMap || {});

        // Extract unique lengths and faceshapes
        const lengths = new Set();
        const shapes = new Set();
        Object.values(data.categoryMap || {}).forEach(cat => {
          if (cat.length) lengths.add(cat.length);
          if (cat.faceshape) shapes.add(cat.faceshape);
        });
        setLengthOptions(Array.from(lengths));
        setShapeOptions(Array.from(shapes));
      });
  }, []);

  // Filter hairstyles when filters change
  useEffect(() => {
    let filtered = allHairstyles;

    if (selectedLength) {
      // Find all category IDs with this length
      const lengthIds = Object.values(categoryMap)
        .filter(cat => cat.length === selectedLength)
        .map(cat => cat.id);
      filtered = filtered.filter(h => lengthIds.includes(h.lengthCategoryId));
    }

    if (selectedShape) {
      // Find all category IDs with this faceshape
      const shapeIds = Object.values(categoryMap)
        .filter(cat => cat.faceshape === selectedShape)
        .map(cat => cat.id);
      filtered = filtered.filter(h => shapeIds.includes(h.faceshapeCategoryId));
    }

    setHairstyles(filtered);
  }, [selectedLength, selectedShape, allHairstyles, categoryMap]);

  return (
    <div className="container d-flex flex-column justify-content-between min-vh-100 py-3">
      {/* Top pickers */}
      <div className="row mb-4">
        <div className="col-6">
          <select
            className="form-select"
            value={selectedLength}
            onChange={e => setSelectedLength(e.target.value)}
          >
            <option value="">Length</option>
            {lengthOptions.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <select
            className="form-select"
            value={selectedShape}
            onChange={e => setSelectedShape(e.target.value)}
          >
            <option value="">Shape</option>
            {shapeOptions.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
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
          <button className="btn btn-outline-success">Create</button>
        </div>
      </div>
    </div>
  );
}

export default App;
