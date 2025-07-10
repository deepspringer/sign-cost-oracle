
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SignProject } from '@/types';

interface ProjectAdminProps {
  projects: SignProject[];
  onAddProject: (project: Omit<SignProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProject: (id: string, project: Partial<SignProject>) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectAdmin: React.FC<ProjectAdminProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Omit<SignProject, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    signType: 'pylon',
    height: 0,
    width: 0,
    materialType: '',
    paintColors: 1,
    hasLighting: false,
    quality: 'standard',
    complexity: 'medium',
    totalCost: 0,
    materialCost: 0,
    laborCost: 0,
    description: '',
  });

  const handleAddProject = () => {
    if (newProject.name && newProject.totalCost > 0) {
      onAddProject(newProject);
      setNewProject({
        name: '',
        signType: 'pylon',
        height: 0,
        width: 0,
        materialType: '',
        paintColors: 1,
        hasLighting: false,
        quality: 'standard',
        complexity: 'medium',
        totalCost: 0,
        materialCost: 0,
        laborCost: 0,
        description: '',
      });
      setIsAddingProject(false);
    }
  };

  const formatSignType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Database</h1>
          <p className="text-gray-600">Manage historical sign projects and their costs</p>
        </div>
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Enter the details of a completed sign project for future cost estimation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., ABC Company Storefront Sign"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signType">Sign Type</Label>
                  <Select value={newProject.signType} onValueChange={(value: any) => 
                    setNewProject(prev => ({ ...prev, signType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pylon">Pylon Sign</SelectItem>
                      <SelectItem value="channel_letters">Channel Letters</SelectItem>
                      <SelectItem value="monument">Monument Sign</SelectItem>
                      <SelectItem value="wall">Wall Sign</SelectItem>
                      <SelectItem value="flat_cutout">Flat Cutout Letters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="materialType">Material Type</Label>
                  <Input
                    id="materialType"
                    value={newProject.materialType}
                    onChange={(e) => setNewProject(prev => ({ ...prev, materialType: e.target.value }))}
                    placeholder="e.g., Aluminum, Acrylic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (feet)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="0"
                    step="0.1"
                    value={newProject.height || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      height: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="width">Width (feet)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="0"
                    step="0.1"
                    value={newProject.width || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      width: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quality">Quality Level</Label>
                  <Select value={newProject.quality} onValueChange={(value: any) =>
                    setNewProject(prev => ({ ...prev, quality: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="complexity">Complexity</Label>
                  <Select value={newProject.complexity} onValueChange={(value: any) =>
                    setNewProject(prev => ({ ...prev, complexity: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paintColors">Paint Colors</Label>
                  <Input
                    id="paintColors"
                    type="number"
                    min="1"
                    value={newProject.paintColors}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      paintColors: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="lighting"
                    checked={newProject.hasLighting}
                    onCheckedChange={(checked) => 
                      setNewProject(prev => ({ ...prev, hasLighting: checked }))
                    }
                  />
                  <Label htmlFor="lighting">Includes Lighting</Label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalCost">Total Cost ($)</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    min="0"
                    value={newProject.totalCost || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      totalCost: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="materialCost">Material Cost ($)</Label>
                  <Input
                    id="materialCost"
                    type="number"
                    min="0"
                    value={newProject.materialCost || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      materialCost: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="laborCost">Labor Cost ($)</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    min="0"
                    value={newProject.laborCost || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      laborCost: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional project details..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingProject(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    {formatSignType(project.signType)} • {project.height}' × {project.width}'
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-semibold text-green-600">
                  ${project.totalCost.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Material:</span>
                <span>${project.materialCost.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labor:</span>
                <span>${project.laborCost.toLocaleString()}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className={getQualityColor(project.quality)}>
                  {project.quality}
                </Badge>
                <Badge className={getComplexityColor(project.complexity)}>
                  {project.complexity}
                </Badge>
                {project.hasLighting && (
                  <Badge variant="outline">Lighting</Badge>
                )}
              </div>

              <div className="text-xs text-gray-600">
                <div>Material: {project.materialType}</div>
                <div>Colors: {project.paintColors}</div>
                {project.description && (
                  <div className="mt-1 line-clamp-2">{project.description}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first completed project to build the cost estimation database.</p>
          <Button onClick={() => setIsAddingProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectAdmin;
