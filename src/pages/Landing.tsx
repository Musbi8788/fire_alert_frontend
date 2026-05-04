import { Link } from "wouter";
import { Button } from "@/components/ui";
import { ShieldAlert, BellRing, MapPin, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Emergency background" 
            className="w-full h-full object-cover opacity-15 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Official Gambia Emergency Service
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                Report Fires <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Instantly.</span><br/> Save Lives.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                The rapid response platform connecting citizens directly to emergency services in The Gambia. Real-time GPS tracking for faster deployment.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg group">
                    Report Emergency Now
                    <ShieldAlert className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">GPS Auto-Detect</h3>
              <p className="text-muted-foreground">Instantly pinpoint your location so first responders know exactly where to go without confusing directions.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Status Tracking</h3>
              <p className="text-muted-foreground">Monitor the status of your report in real-time from pending to dispatch to fully resolved.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <BellRing className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Dispatch</h3>
              <p className="text-muted-foreground">Reports go directly to the central command dashboard, eliminating phone wait times during critical moments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
