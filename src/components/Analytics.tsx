
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Package, Zap } from 'lucide-react';
import { SignProject } from '@/types';

interface AnalyticsProps {
  projects: SignProject[];
}

const Analytics: React.FC<AnalyticsProps> = ({ projects }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate analytics data
  const totalProjects = projects.length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalCost, 0);
  const averageProjectCost = totalProjects > 0 ? totalRevenue / totalProjects : 0;
  const averageArea = totalProjects > 0 ? projects.reduce((sum, p) => sum + (p.height * p.width), 0) / totalProjects : 0;

  // Sign type distribution
  const signTypeData = projects.reduce((acc, project) => {
    const type = project.signType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const signTypeChartData = Object.entries(signTypeData).map(([name, value]) => ({ name, value }));

  // Cost by quality
  const qualityData = projects.reduce((acc, project) => {
    const quality = project.quality.charAt(0).toUpperCase() + project.quality.slice(1);
    if (!acc[quality]) {
      acc[quality] = { quality, totalCost: 0, count: 0 };
    }
    acc[quality].totalCost += project.totalCost;
    acc[quality].count += 1;
    return acc;
  }, {} as Record<string, { quality: string; totalCost: number; count: number }>);

  const qualityChartData = Object.values(qualityData).map(item => ({
    quality: item.quality,
    averageCost: item.totalCost / item.count,
    totalProjects: item.count,
  }));

  // Monthly project data (simulated based on created dates)
  const monthlyData = projects.reduce((acc, project) => {
    const month = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, projects: 0, revenue: 0 };
    }
    acc[month].projects += 1;
    acc[month].revenue += project.totalCost;
    return acc;
  }, {} as Record<string, { month: string; projects: number; revenue: number }>);

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights and trends from your sign project data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Project Cost</p>
                <p className="text-2xl font-bold text-gray-900">${averageProjectCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Area (sq ft)</p>
                <p className="text-2xl font-bold text-gray-900">{averageArea.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data to analyze</h3>
            <p className="text-gray-600">Add some projects to see analytics and insights.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sign Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sign Type Distribution</CardTitle>
              <CardDescription>Breakdown of projects by sign type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={signTypeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {signTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average Cost by Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Average Cost by Quality</CardTitle>
              <CardDescription>Cost comparison across quality levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualityChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quality" />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Average Cost']} />
                  <Bar dataKey="averageCost" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Revenue Trend */}
          {monthlyChartData.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue generated over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Project Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Project Insights</CardTitle>
              <CardDescription>Key findings from your project data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Most Common Sign Type</span>
                <Badge variant="secondary">
                  {signTypeChartData.length > 0 ? signTypeChartData.reduce((a, b) => a.value > b.value ? a : b).name : 'N/A'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Highest Revenue Quality</span>
                <Badge variant="secondary">
                  {qualityChartData.length > 0 ? qualityChartData.reduce((a, b) => a.averageCost > b.averageCost ? a : b).quality : 'N/A'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Projects with Lighting</span>
                <Badge variant="secondary">
                  {projects.filter(p => p.hasLighting).length} of {totalProjects}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Avg Material to Labor Ratio</span>
                <Badge variant="secondary">
                  {totalProjects > 0 ? 
                    (projects.reduce((sum, p) => sum + (p.materialCost / (p.laborCost || 1)), 0) / totalProjects).toFixed(1) + ':1' 
                    : 'N/A'
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
