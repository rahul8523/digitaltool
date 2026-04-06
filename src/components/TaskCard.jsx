const TaskCard = ({ title, count, bgColor, link, loading }) => (
  <div className="mb-3">
    <div className={`card text-white ${bgColor} h-100`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        {loading ? (
          <div className="spinner-border text-light" role="status" style={{ width: '2rem', height: '2rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <h3 className="card-text">{count}</h3>
        )}
      </div>
      <div className="card-footer bg-transparent border-top-0">
        <a
          href={link}
          className="text-white text-decoration-none d-flex justify-content-between align-items-center"
        >
          More info <i className="bi bi-arrow-right-circle"></i>
        </a>
      </div>
    </div>
  </div>
);



export default TaskCard;