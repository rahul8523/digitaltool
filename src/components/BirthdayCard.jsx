import React from "react";

const BirthdayCard = () => {
  const Birthdays = [
    { name: "shikha", date: "2025-10-24" },
    { name: "sneha", date: "2025-6-20" },
    { name: "priya", date: "2025-10-25" },
    { name: "riya", date: "2025-10-1" },
    { name: "vishal", date: "2025-11-24" },
    { name: "shivam", date: "2025-11-24" }
  ]

  const today = new Date()
  const month = today.getMonth() + 1
  const currentMonth = Birthdays.filter((a) => {
    const Bmonth = new Date(a.date).getMonth() + 1;
    return Bmonth === month;
  }

  )
  return (
    <>
      <div className="card shadow-sm mb-3" style={{
        background: "linear-gradient(135deg, #fff3cd, #ffe0b2)",
        borderRadius: "16px",
        border: "1px solid #f7c948",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h4 style={{ fontWeight: "700", fontSize: "18px", marginBottom: "15px" , textAlign:"center"}}>
          🎉 This Month's Birthdays
        </h4>
        {
          currentMonth.length === 0 ? (
            <p>No birthdays in October</p>
          ) :
            (
              currentMonth.map((a, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: idx !== currentMonth.length - 1 ? "1px solid #f0e0b0" : "none"
                }}>
                  <span style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>
                    🎂 {a.name}
                  </span>
                  <span style={{ color: "#555", fontSize: "14px" }}>
                    {new Date(a.date).getDate()} {new Date(a.date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
              )
              )
            )
        }
      </div>
    </>

  )
}
export default BirthdayCard