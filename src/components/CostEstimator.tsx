
import React, { useState } from 'react';
import { Calculator, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SignProject, CostEstimate, SignSpecification } from '@/types';

interface CostEstimatorProps {
  projects: SignProject[];
}

const CostEstimator: React.FC<CostEstimatorProps> = ({ projects }) => {
  const [specification, setSpecification] = useState<SignSpecification>({
    signType: '',
    height: 0,
    width: 0,
    materialType: '',
    paintColors: 1,
    hasLighting: false,
    quality: '',
    complexity: '',
    description: '',
  });

  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSimilarity = (spec: SignSpecification, project: SignProject): number => {
    let score = 0;
    let maxScore = 0;

    // Sign type match (highest weight)
    maxScore += 30;
    if (spec.signType === project.signType) score += 30;

    // Size similarity (area comparison)
    maxScore += 25;
    const specArea = spec.height * spec.width;
    const projectArea = project.height * project.width;
    if (specArea > 0 && projectArea > 0) {
      const areaDiff = Math.abs(specArea - projectArea) / Math.max(specArea, projectArea);
      score += 25 * (1 - areaDiff);
    }

    // Material type
    maxScore += 20;
    if (spec.materialType && spec.materialType.toLowerCase() === project.materialType.toLowerCase()) {
      score += 20;
    }

    // Quality level
    maxScore += 15;
    if (spec.quality === project.quality) score += 15;

    // Complexity level
    maxScore += 10;
    if (spec.complexity === project.complexity) score += 10;

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  const generateEstimate = (spec: SignSpecification): CostEstimate => {
    if (projects.length === 0) {
      return {
        minCost: 500,
        maxCost: 2000,
        averageCost: 1250,
        confidence: 20,
        similarProjects: [],
      };
    }

    // Calculate similarity scores for all projects
    const projectsWithSimilarity = projects.map(project => ({
      ...project,
      similarity: calculateSimilarity(spec, project),
    }));

    // Get top 10 most similar projects
    const similarProjects = projectsWithSimilarity
      .filter(p => p.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    if (similarProjects.length === 0) {
      // Fallback to basic estimation
      const baseArea = spec.height * spec.width;
      const baseCost = baseArea * 15; // $15 per sq ft base
      
      let multiplier = 1;
      if (spec.quality === 'premium') multiplier *= 1.5;
      else if (spec.quality === 'standard') multiplier *= 1.2;
      
      if (spec.complexity === 'high') multiplier *= 1.4;
      else if (spec.complexity === 'medium') multiplier *= 1.2;
      
      if (spec.hasLighting) multiplier *= 1.3;
      
      const estimatedCost = baseCost * multiplier;
      
      return {
        minCost: estimatedCost * 0.8,
        maxCost: estimatedCost * 1.4,
        averageCost: estimatedCost,
        confidence: 30,
        similarProjects: [],
      };
    }

    // Calculate weighted average based on similarity
    let totalWeightedCost = 0;
    let totalWeight = 0;
    const costs = similarProjects.map(p => p.totalCost);

    similarProjects.forEach(project => {
      const weight = project.similarity / 100;
      totalWeightedCost += project.totalCost * weight;
      totalWeight += weight;
    });

    const averageCost = totalWeight > 0 ? totalWeightedCost / totalWeight : 0;
    const minCost = Math.min(...costs) * 0.9;
    const maxCost = Math.max(...costs) * 1.1;
    
    // Confidence based on number of similar projects and their similarity scores
    const avgSimilarity = similarProjects.reduce((sum, p) => sum + p.similarity, 0) / similarProjects.length;
    const confidence = Math.min(90, (similarProjects.length * 10) + (avgSimilarity * 0.5));

    return {
      minCost,
      maxCost,
      averageCost,
      confidence,
      similarProjects: similarProjects.slice(0, 5),
    };
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const newEstimate = generateEstimate(specification);
      setEstimate(newEstimate);
      setIsCalculating(false);
    }, 1000);
  };

  const isFormValid = () => {
    return (
      specification.signType &&
      specification.height > 0 &&
      specification.width > 0 &&
      specification.materialType &&
      specification.quality &&
      specification.complexity
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Cost Estimator</h1>
        <p className="text-gray-600">Enter sign specifications to get cost estimates based on historical data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Sign Specifications</span>
            </CardTitle>
            <CardDescription>
              Provide details about the sign to generate cost estimates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signType">Sign Type</Label>
                <Select value={specification.signType} onValueChange={(value) => 
                  setSpecification(prev => ({ ...prev, signType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Select value={specification.materialType} onValueChange={(value) =>
                  setSpecification(prev => ({ ...prev, materialType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                    <SelectItem value="acrylic">Acrylic</SelectItem>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="vinyl">Vinyl</SelectItem>
                    <SelectItem value="wood">Wood</SelectItem>
                    <SelectItem value="composite">Composite</SelectItem>
                  </SelectContent>
                </Select>
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
                  value={specification.height || ''}
                  onChange={(e) => setSpecification(prev => ({ 
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
                  value={specification.width || ''}
                  onChange={(e) => setSpecification(prev => ({ 
                    ...prev, 
                    width: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality">Quality Level</Label>
                <Select value={specification.quality} onValueChange={(value) =>
                  setSpecification(prev => ({ ...prev, quality: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
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
                <Select value={specification.complexity} onValueChange={(value) =>
                  setSpecification(prev => ({ ...prev, complexity: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
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
                <Label htmlFor="paintColors">Number of Paint Colors</Label>
                <Input
                  id="paintColors"
                  type="number"
                  min="1"
                  value={specification.paintColors}
                  onChange={(e) => setSpecification(prev => ({ 
                    ...prev, 
                    paintColors: parseInt(e.target.value) || 1 
                  }))}
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="lighting"
                  checked={specification.hasLighting}
                  onCheckedChange={(checked) => 
                    setSpecification(prev => ({ ...prev, hasLighting: checked }))
                  }
                />
                <Label htmlFor="lighting">Includes Lighting</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Additional Description</Label>
              <Textarea
                id="description"
                placeholder="Any additional details about the sign..."
                value={specification.description}
                onChange={(e) => setSpecification(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
              />
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={!isFormValid() || isCalculating}
              className="w-full"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Cost Estimate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {estimate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Cost Estimate</span>
              </CardTitle>
              <CardDescription>
                Based on {projects.length} historical projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${estimate.averageCost.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Range: ${estimate.minCost.toLocaleString()} - ${estimate.maxCost.toLocaleString()}
                </div>
                <div className="mt-2">
                  <Badge variant={estimate.confidence > 70 ? "default" : estimate.confidence > 40 ? "secondary" : "destructive"}>
                    {estimate.confidence.toFixed(0)}% Confidence
                  </Badge>
                </div>
              </div>

              {estimate.similarProjects.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-1" />
                    Similar Projects
                  </h4>
                  <div className="space-y-2">
                    {estimate.similarProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{project.name}</span>
                          <span className="text-green-600 font-semibold">
                            ${project.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {project.signType.replace('_', ' ')} • {project.height}' × {project.width}' • {project.materialType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CostEstimator;
