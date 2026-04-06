// context/UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [employee, setEmployeeState] = useState(null);

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employee');
    if (storedEmployee) {
      setEmployeeState(JSON.parse(storedEmployee));
    }
  }, []);

  const setEmployee = (employeeData) => {
    setEmployeeState(employeeData);
    localStorage.setItem('employee', JSON.stringify(employeeData));
  };

  return (
    <UserContext.Provider value={{ employee, setEmployee }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
