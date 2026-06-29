import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import '../styles/AdminPanel.css';

export function AdminPanel() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'prompt',
    title: '',
    description: '',
    difficulty: 'beginner',
    estimated_time: '5 min',
    roles: [],
    industries: [],
    tags: [],
    content: {},
  });
  const [roles, setRoles] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalUsers: 0,
    totalViews: 0,
  });

  useEffect(() => {
    loadContent();
    loadOptions();
    loadStats();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await api.listContent({});
      setContent(response.data || []);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const response = await api.getProfileOptions();
      setRoles(response.data?.roles || []);
      setIndustries(response.data?.industries || []);
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const loadStats = async () => {
    try {
      // TODO: Create analytics endpoint
      setStats({
        totalContent: 0,
        totalUsers: 0,
        totalViews: 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.updateContent(editingId, {
          type: formData.type,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          estimated_time: formData.estimated_time,
          roles: formData.roles,
          industries: formData.industries,
          tags: formData.tags,
          content: formData.content,
        });
      } else {
        await api.createContent({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          estimated_time: formData.estimated_time,
          roles: formData.roles,
          industries: formData.industries,
          tags: formData.tags,
          content: formData.content,
        });
      }
      resetForm();
      loadContent();
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.deleteContent(id);
      loadContent();
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      difficulty: item.difficulty,
      estimated_time: item.estimated_time,
      roles: item.roles || [],
      industries: item.industries || [],
      tags: item.tags || [],
      content: item.content || {},
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: 'prompt',
      title: '',
      description: '',
      difficulty: 'beginner',
      estimated_time: '5 min',
      roles: [],
      industries: [],
      tags: [],
      content: {},
    });
    setShowForm(false);
  };

  const handleContentChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    const currentArray = formData[field];
    if (currentArray.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(v => v !== value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Content Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Content'}
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{content.length}</div>
          <div className="stat-label">Total Content</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">18</div>
          <div className="stat-label">Prompts & Guides</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Tutorials</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Case Studies</div>
        </div>
      </div>

      {showForm && (
        <div className="admin-form">
          <h2>{editingId ? 'Edit Content' : 'Create New Content'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="prompt">Prompt</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="caseStudy">Case Study</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time Estimate</label>
                <input type="text" value={formData.estimated_time} onChange={(e) => setFormData({...formData, estimated_time: e.target.value})} placeholder="5 min" />
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Roles (select applicable)</label>
              <div className="checkbox-group">
                {roles.map(role => (
                  <label key={role} className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleArrayChange('roles', role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Industries (select applicable)</label>
              <div className="checkbox-group">
                {industries.map(ind => (
                  <label key={ind} className="checkbox">
                    <input
                      type="checkbox"
                      checked={formData.industries.includes(ind)}
                      onChange={() => handleArrayChange('industries', ind)}
                    />
                    {ind}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                placeholder="Python, Analytics, SQL"
              />
            </div>

            {formData.type === 'prompt' && (
              <div className="form-group">
                <label>Prompt Content *</label>
                <textarea required value={formData.content.prompt || ''} onChange={(e) => handleContentChange('prompt', e.target.value)} placeholder="Enter the prompt..." />
                <label>Pro Tip</label>
                <textarea value={formData.content.tips || ''} onChange={(e) => handleContentChange('tips', e.target.value)} placeholder="Pro tip for using this prompt..." />
              </div>
            )}

            {formData.type === 'tutorial' && (
              <div className="form-group">
                <label>Tutorial Steps (JSON format)</label>
                <textarea value={JSON.stringify(formData.content.steps || [], null, 2)} onChange={(e) => {
                  try {
                    handleContentChange('steps', JSON.parse(e.target.value));
                  } catch (err) {
                    console.error('Invalid JSON');
                  }
                }} placeholder='[{"title":"Step 1","content":"..."}]' />
              </div>
            )}

            {formData.type === 'caseStudy' && (
              <>
                <div className="form-group">
                  <label>Challenge</label>
                  <textarea value={formData.content.challenge || ''} onChange={(e) => handleContentChange('challenge', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Solution</label>
                  <textarea value={formData.content.solution || ''} onChange={(e) => handleContentChange('solution', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Results</label>
                  <textarea value={formData.content.results || ''} onChange={(e) => handleContentChange('results', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Key Takeaway</label>
                  <textarea value={formData.content.keyTakeaway || ''} onChange={(e) => handleContentChange('keyTakeaway', e.target.value)} />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Content' : 'Create Content'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Roles</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : content.length === 0 ? (
              <tr><td colSpan="5">No content yet</td></tr>
            ) : (
              content.map(item => (
                <tr key={item.id}>
                  <td className="title">{item.title}</td>
                  <td className="type">{item.type}</td>
                  <td className="roles">{(item.roles || []).join(', ')}</td>
                  <td className="difficulty">{item.difficulty}</td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
