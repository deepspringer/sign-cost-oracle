
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import CostEstimator from '@/components/CostEstimator';
import ProjectAdmin from '@/components/ProjectAdmin';
import Analytics from '@/components/Analytics';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'estimator' | 'admin' | 'analytics'>('estimator');
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sign Cost Oracle</h1>
              <p className="text-gray-600">Professional sign cost estimation system</p>
            </div>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        ) : (
          <>
            {activeTab === 'estimator' && (
              <CostEstimator projects={projects} />
            )}
            
            {activeTab === 'admin' && (
              <ProjectAdmin
                projects={projects}
                onAddProject={addProject}
                onUpdateProject={updateProject}
                onDeleteProject={deleteProject}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics projects={projects} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
