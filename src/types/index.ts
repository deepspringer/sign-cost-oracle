
export interface SignProject {
  id: string;
  name: string;
  signType: 'pylon' | 'channel_letters' | 'monument' | 'wall' | 'flat_cutout';
  height: number;
  width: number;
  materialType: string;
  paintColors: number;
  hasLighting: boolean;
  quality: 'basic' | 'standard' | 'premium';
  complexity: 'low' | 'medium' | 'high';
  totalCost: number;
  materialCost: number;
  laborCost: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostEstimate {
  minCost: number;
  maxCost: number;
  averageCost: number;
  confidence: number;
  similarProjects: SignProject[];
}

export interface SignSpecification {
  signType: string;
  height: number;
  width: number;
  materialType: string;
  paintColors: number;
  hasLighting: boolean;
  quality: string;
  complexity: string;
  description?: string;
}
