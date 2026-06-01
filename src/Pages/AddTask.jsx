import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    subject: '',
    description: '',
    client_id: '',
    assigned_date: new Date().toISOString().split('T')[0],
    assigned_time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
    due_date: '',
    due_time: '',
    priority: '',
    comment: '',
    documents: [],
  });

  useEffect(() => {
    axiosInstance.get('/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error("Error fetching clients:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setTaskDetails(prev => ({
      ...prev,
      documents: [...e.target.files]
    }));
  };

  // Creating new task for self
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('subject', taskDetails.subject);
    formData.append('description', taskDetails.description);
    formData.append('client_id', taskDetails.client_id);
    formData.append('assigned_date', `${taskDetails.assigned_date} ${taskDetails.assigned_time}:00`); // add seconds
    formData.append('due_date', taskDetails.due_date); // e.g. "2025-07-22"
    formData.append('due_time', taskDetails.due_time); // e.g. "14:30"
    formData.append('priority', taskDetails.priority);
    formData.append('comment', taskDetails.comment);
    formData.append('assigned_by', 'Self Assign');

    taskDetails.documents.forEach(file => {
      formData.append('documents[]', file);
    });

    try {
      await axiosInstance.post('/member-tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          withCredentials: true,
        }
      });

      toast.success('Task Created Successfully');
      setTaskDetails({
        subject: '',
        description: '',
        client_id: '',
        assigned_date: new Date().toISOString().split('T')[0],
        assigned_time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
        due_date: '',
        due_time: '',
        priority: '',
        comment: '',
        documents: []
      });
    } catch (error) {
      console.error('Task creation failed:', error.response?.data || error);
      toast.error('Task creation failed. Please check required fields.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        navigate('/dashboard/task'); // 👈 Replace '/tasks' with your actual listing route
      }, 1000);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          <button
            className="btn btn-outline-dark rounded-circle mb-3"
            style={{ width: '40px', height: '40px' }}
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h4 className="mb-4">Add New Task</h4>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Task Subject</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={taskDetails.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  name="client_id"
                  value={taskDetails.client_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={taskDetails.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Attach Documents</label>
                <input
                  type="file"
                  className="form-control"
                  name="documents"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Assigned Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="assigned_date"
                  value={taskDetails.assigned_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Assigned Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="assigned_time"
                  value={taskDetails.assigned_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="due_date"
                  value={taskDetails.due_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Due Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="due_time"
                  value={taskDetails.due_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  name="priority"
                  value={taskDetails.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Priority --</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  name="comment"
                  rows="2"
                  value={taskDetails.comment}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
