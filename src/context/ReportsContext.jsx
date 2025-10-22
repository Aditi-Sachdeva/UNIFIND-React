import React, { createContext, useState, useContext, useEffect } from 'react';

const ReportsContext = createContext(undefined);

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    // Load reports from localStorage on init
    const savedReports = localStorage.getItem('unifind_reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });

  // Save to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('unifind_reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString(),
      status: 'pending' // Admin verification status (pending/verified/rejected)
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReport = (id, updatedData) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, ...updatedData } : report
      )
    );
  };

  const deleteReport = (id) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};