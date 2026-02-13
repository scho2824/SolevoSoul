import Sidebar from "@/components/Dashboard/Sidebar";
import BottomNav from "@/components/Dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main Content Area */}
            <main className="md:pl-64 min-h-screen pb-20 md:pb-0">
                <div className="max-w-5xl mx-auto md:p-8 p-4">
                    {children}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
