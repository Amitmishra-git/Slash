import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Mail, Phone, Calendar, MapPin, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock data for existing providers - replace with actual data from your backend
const mockProviders = [
  {
    id: "1",
    name: "Adventure Tours India",
    email: "contact@adventuretours.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinDate: "2024-01-15",
    status: "active",
    experiences: 8,
    rating: 4.8
  },
  {
    id: "2",
    name: "Heritage Walks",
    email: "info@heritagewalks.com",
    phone: "+91 98765 43211",
    location: "Delhi, NCR",
    joinDate: "2024-02-01",
    status: "active",
    experiences: 5,
    rating: 4.5
  },
];

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ 
          featured: true,
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error approving experience:', error);
        throw error;
      }

      toast.success('Experience approved successfully');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error approving experience:', error);
      toast.error('Failed to approve experience');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ 
          featured: false,
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting experience:', error);
        throw error;
      }

      toast.success('Experience rejected');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting experience:', error);
      toast.error('Failed to reject experience');
    }
  };

  const handleViewDetails = (application: any) => {
    // You can implement a modal or navigate to a details page
    console.log('View details for:', application);
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary" as const,
      approved: "default" as const,
      rejected: "destructive" as const
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Experience Providers</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Experience Applications</CardTitle>
            <CardDescription>Review and manage experience applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experience Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.title}</TableCell>
                    <TableCell>{application.location}</TableCell>
                    <TableCell>{application.category}</TableCell>
                    <TableCell>₹{application.price}</TableCell>
                    <TableCell>{application.duration}</TableCell>
                    <TableCell>
                      <Badge variant={application.featured ? "success" : "secondary"}>
                        {application.featured ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(application)}>
                            View Details
                          </DropdownMenuItem>
                          {!application.featured && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(application.id)}>
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(application.id)}>
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Providers; 
