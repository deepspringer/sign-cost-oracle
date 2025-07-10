
import React, { useState } from 'react';
import Header from '@/components/Header';
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
      <Header />

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
