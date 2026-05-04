import { useState } from "react";
import { Card, Badge } from "@/components/ui";
import { useAdminReports, useAdminStats, useAdminUpdateStatus } from "@/hooks/use-auth-queries";
import { formatDate } from "@/lib/utils";
import { ReportsMap } from "@/components/map";
import { AlertTriangle, Clock, CheckCircle2, Flame, RefreshCcw, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UpdateStatusRequestStatus } from "@workspace/api-client-react";

export default function AdminDashboard() {
  const [filter, setFilter] = useState<string>("all");
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: reports, isLoading: reportsLoading } = useAdminReports(
    filter !== "all" ? { status: filter as any } : undefined
  );
  const { mutateAsync: updateStatus } = useAdminUpdateStatus();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: UpdateStatusRequestStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus(id, { status: newStatus });
      toast({ title: "Status Updated", description: `Report #${id} marked as ${newStatus}` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Command Center</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 animate-spin-slow" /> Live updating every 10 seconds
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Reports</p>
                <h3 className="text-3xl font-bold">{statsLoading ? "-" : stats?.total}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Flame className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-yellow-500 shadow-sm bg-yellow-50/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-yellow-700">{statsLoading ? "-" : stats?.pending}</h3>
              </div>
              <div className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-orange-500 shadow-sm bg-orange-50/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">In Progress</p>
                <h3 className="text-3xl font-bold text-orange-700">{statsLoading ? "-" : stats?.inProgress}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg"><Clock className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-500 shadow-sm bg-green-50/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Resolved</p>
                <h3 className="text-3xl font-bold text-green-700">{statsLoading ? "-" : stats?.resolved}</h3>
              </div>
              <div className="p-2 bg-green-500/10 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-[500px]">
          {/* Map View */}
          <Card className="flex flex-col shadow-md overflow-hidden">
            <div className="p-4 border-b bg-card flex justify-between items-center z-10 relative">
              <h2 className="font-semibold flex items-center gap-2">Live Map View</h2>
              <Badge variant="default" className="bg-primary/10 text-primary">{reports?.length || 0} active pins</Badge>
            </div>
            <div className="flex-1 min-h-[400px] relative z-0">
              <ReportsMap reports={reports || []} className="w-full h-full rounded-none border-0" />
            </div>
          </Card>

          {/* List View */}
          <Card className="flex flex-col shadow-md overflow-hidden">
            <div className="p-4 border-b bg-card flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative">
              <h2 className="font-semibold">Recent Incident Feed</h2>
              <div className="flex bg-muted p-1 rounded-lg">
                {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${filter === f ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-muted/10 space-y-3 relative z-0">
              {reportsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : !reports || reports.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No reports found matching criteria.</div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">#{report.id}</span>
                          <span className="text-xs text-muted-foreground">• {formatDate(report.createdAt)}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{report.fullName} ({report.phone})</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {updatingId === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : null}
                        <select 
                          className={`text-xs font-bold uppercase rounded-full px-3 py-1 border outline-none appearance-none cursor-pointer
                            ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                              report.status === 'in-progress' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                              'bg-green-100 text-green-800 border-green-200'}`}
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value as any)}
                          disabled={updatingId === report.id}
                        >
                          <option value="pending">PENDING</option>
                          <option value="in-progress">IN PROGRESS</option>
                          <option value="resolved">RESOLVED</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-3">
                      {report.description}
                    </p>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{report.address || `${report.latitude}, ${report.longitude}`}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
