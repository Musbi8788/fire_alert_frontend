import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { useMyReports, useSubmitReport } from "@/hooks/use-auth-queries";
import { formatDate } from "@/lib/utils";
import { MapPin, Navigation, AlertTriangle, FileText, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reportSchema = z.object({
  description: z.string().min(10, "Please provide more details (min 10 characters)"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

export default function UserDashboard() {
  const { data: reports, isLoading } = useMyReports();
  const { mutateAsync: submitReport, isPending: isSubmitting } = useSubmitReport();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
  });

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "Error", description: "Geolocation is not supported by your browser" });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
        setIsLocating(false);
        toast({ title: "Location found", description: "GPS coordinates added successfully." });
      },
      (error) => {
        setIsLocating(false);
        toast({ variant: "destructive", title: "Location Error", description: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (data: ReportForm) => {
    try {
      await submitReport(data);
      toast({
        title: "Emergency Reported",
        description: "Authorities have been notified.",
      });
      reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to submit",
        description: error.message || "An error occurred.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Submit new emergencies and track your previous reports.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <Card className="p-6 border-t-4 border-t-destructive shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-destructive/10 p-2 rounded-full text-destructive">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold">Report Fire</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="p-4 bg-muted rounded-xl space-y-4 border border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Location
                  </h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGetLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
                    Auto-detect GPS
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Latitude" type="number" step="any" {...register("latitude")} error={errors.latitude?.message} placeholder="13.45" />
                  <Input label="Longitude" type="number" step="any" {...register("longitude")} error={errors.longitude?.message} placeholder="-16.57" />
                </div>
                <Input label="Street Address / Landmark (Optional)" {...register("address")} placeholder="e.g. Near Banjul Market" />
              </div>

              <Textarea 
                label="Emergency Description" 
                placeholder="Describe the fire size, what is burning, and any immediate danger to life..."
                {...register("description")} 
                error={errors.description?.message}
                className="min-h-[120px]"
              />

              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 text-white" size="lg" isLoading={isSubmitting}>
                Submit Emergency Report
              </Button>
            </form>
          </Card>
        </div>

        {/* History Column */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-2xl font-display font-bold">My Reports History</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !reports || reports.length === 0 ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center bg-muted/30 border-dashed">
              <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                <ShieldAlert className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No reports yet</h3>
              <p className="text-muted-foreground max-w-sm mt-2">You haven't submitted any emergency reports. When you do, they will appear here for tracking.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="p-5 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg">Report #{report.id}</span>
                        <Badge variant={report.status}>{report.status}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="text-sm bg-muted px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium truncate max-w-[200px]">{report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}</span>
                    </div>
                  </div>
                  <p className="text-foreground/90 bg-background border border-border/50 p-4 rounded-xl text-sm leading-relaxed">
                    {report.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
