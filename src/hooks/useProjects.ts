
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SignProject } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState<SignProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sign_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: SignProject[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        signType: project.sign_type,
        height: parseFloat(project.height.toString()),
        width: parseFloat(project.width.toString()),
        materialType: project.material_type,
        paintColors: project.paint_colors,
        hasLighting: project.has_lighting,
        quality: project.quality,
        complexity: project.complexity,
        totalCost: parseFloat(project.total_cost.toString()),
        materialCost: parseFloat(project.material_cost.toString()),
        laborCost: parseFloat(project.labor_cost.toString()),
        description: project.description,
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at),
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (newProject: Omit<SignProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('sign_projects')
        .insert([{
          name: newProject.name,
          sign_type: newProject.signType,
          height: newProject.height,
          width: newProject.width,
          material_type: newProject.materialType,
          paint_colors: newProject.paintColors,
          has_lighting: newProject.hasLighting,
          quality: newProject.quality,
          complexity: newProject.complexity,
          total_cost: newProject.totalCost,
          material_cost: newProject.materialCost,
          labor_cost: newProject.laborCost,
          description: newProject.description,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project added successfully!",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (id: string, updates: Partial<SignProject>) => {
    try {
      const { error } = await supabase
        .from('sign_projects')
        .update({
          name: updates.name,
          sign_type: updates.signType,
          height: updates.height,
          width: updates.width,
          material_type: updates.materialType,
          paint_colors: updates.paintColors,
          has_lighting: updates.hasLighting,
          quality: updates.quality,
          complexity: updates.complexity,
          total_cost: updates.totalCost,
          material_cost: updates.materialCost,
          labor_cost: updates.laborCost,
          description: updates.description,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project updated successfully!",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sign_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
