import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ClassroomView = ({ classrooms }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Active Classrooms</h2>
      {classrooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No active classrooms found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {classrooms.map((classroom) => (
            <div key={classroom._id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{classroom.name}</h3>
                  <p className="text-gray-600 mt-1">{classroom.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Code: {classroom.classCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-2xl font-bold text-blue-600">{classroom.students?.length || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomView;