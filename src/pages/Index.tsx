
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CostEstimator from '@/components/CostEstimator';
import ProjectAdmin from '@/components/ProjectAdmin';
import Analytics from '@/components/Analytics';
import { SignProject } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'estimator' | 'admin' | 'analytics'>('estimator');
  const [projects, setProjects] = useState<SignProject[]>([]);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('signProjects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    } else {
      // Add some sample data for demonstration
      const sampleProjects: SignProject[] = [
        {
          id: '1',
          name: 'ABC Company Storefront',
          signType: 'channel_letters',
          height: 2.5,
          width: 12,
          materialType: 'Aluminum',
          paintColors: 2,
          hasLighting: true,
          quality: 'standard',
          complexity: 'medium',
          totalCost: 4500,
          materialCost: 2200,
          laborCost: 2300,
          description: 'LED channel letters with aluminum face and acrylic backing',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Main Street Monument',
          signType: 'monument',
          height: 6,
          width: 8,
          materialType: 'Stone/Steel',
          paintColors: 3,
          hasLighting: true,
          quality: 'premium',
          complexity: 'high',
          totalCost: 12500,
          materialCost: 7500,
          laborCost: 5000,
          description: 'Stone base with steel frame and LED illumination',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
        },
        {
          id: '3',
          name: 'Restaurant Pylon Sign',
          signType: 'pylon',
          height: 20,
          width: 6,
          materialType: 'Steel',
          paintColors: 4,
          hasLighting: true,
          quality: 'standard',
          complexity: 'high',
          totalCost: 8750,
          materialCost: 4200,
          laborCost: 4550,
          description: 'Tall pylon sign with digital display area',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-15'),
        },
        {
          id: '4',
          name: 'Office Building Wall Sign',
          signType: 'wall',
          height: 3,
          width: 15,
          materialType: 'Acrylic',
          paintColors: 1,
          hasLighting: false,
          quality: 'basic',
          complexity: 'low',
          totalCost: 1800,
          materialCost: 900,
          laborCost: 900,
          description: 'Simple acrylic wall sign with vinyl lettering',
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-03-01'),
        },
        {
          id: '5',
          name: 'Retail Flat Cut Letters',
          signType: 'flat_cutout',
          height: 1.5,
          width: 8,
          materialType: 'Aluminum',
          paintColors: 2,
          hasLighting: false,
          quality: 'standard',
          complexity: 'medium',
          totalCost: 2200,
          materialCost: 1300,
          laborCost: 900,
          description: 'Precision cut aluminum letters with custom mounting',
          createdAt: new Date('2024-03-10'),
          updatedAt: new Date('2024-03-10'),
        },
      ];
      setProjects(sampleProjects);
      localStorage.setItem('signProjects', JSON.stringify(sampleProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('signProjects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (newProject: Omit<SignProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project: SignProject = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [...prev, project]);
  };

  const handleUpdateProject = (id: string, updates: Partial<SignProject>) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

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
        {activeTab === 'estimator' && (
          <CostEstimator projects={projects} />
        )}
        
        {activeTab === 'admin' && (
          <ProjectAdmin
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics projects={projects} />
        )}
      </main>
    </div>
  );
};

export default Index;
