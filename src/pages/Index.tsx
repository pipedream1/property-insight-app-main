
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TopNavigation from '@/components/TopNavigation';
import { navItems } from '@/nav-items';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Belvidere Estate Management System</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navItems.filter(item => item.to !== '/').map((item) => (
            <Link key={item.to} to={item.to} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl transform hover:scale-105 hover:-translate-y-2 border-0 shadow-md hover:shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-primary-100 to-primary-50 transition-all duration-300 group-hover:from-primary-200 group-hover:to-primary-100 group-hover:shadow-inner">
                  <CardTitle className="text-primary-700 flex items-center gap-2 transition-all duration-300 group-hover:text-primary-800 group-hover:tracking-wide">
                    <span className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      {item.icon}
                    </span>
                    <span className="transition-all duration-200 group-hover:translate-x-1">
                      {item.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-primary-25">
                  {item.to === '/water-readings' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Manage and track water usage from boreholes, reservoir, and municipal supply.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Borehole 1-4 readings</li>
                        <li>• Reservoir level monitoring</li>
                        <li>• Knysna water readings</li>
                        <li>• Monthly usage calculations</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/property-components' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Inspect and document the condition of property assets.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Tennis Courts</li>
                        <li>• Roads & Circles</li>
                        <li>• Utility infrastructure</li>
                        <li>• Common areas</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/maintenance' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Track and manage maintenance tasks across the property.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Active maintenance tasks</li>
                        <li>• Completed task history</li>
                        <li>• Priority management</li>
                        <li>• Photo documentation</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/reports' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Generate and view reports on water usage and property components.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Monthly water usage</li>
                        <li>• Component condition reports</li>
                        <li>• Maintenance history</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/community' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Community platform for residents and management.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Social events and announcements</li>
                        <li>• Classified advertisements</li>
                        <li>• Official documents</li>
                        <li>• Community discussions</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/ai-insights' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Leverage artificial intelligence for smarter property management.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Resident chatbot assistance</li>
                        <li>• Predictive infrastructure planning</li>
                        <li>• Water usage anomaly detection</li>
                        <li>• AI-powered recommendations</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/whatsapp' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Connect with residents through WhatsApp messaging.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Direct resident communications</li>
                        <li>• Broadcast important announcements</li>
                        <li>• Automated responses</li>
                        <li>• Message templates</li>
                      </ul>
                    </>
                  )}
                  {item.to === '/contacts' && (
                    <>
                      <p className="transition-all duration-200 group-hover:text-gray-800">Access important contacts and emergency information.</p>
                      <ul className="mt-2 text-sm text-muted-foreground transition-all duration-200 group-hover:text-gray-600">
                        <li>• Management contacts</li>
                        <li>• Emergency services</li>
                        <li>• Service providers</li>
                        <li>• Resident directory</li>
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
