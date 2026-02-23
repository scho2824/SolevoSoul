import Sidebar from "@/components/Dashboard/Sidebar";
import BottomNav from "@/components/Dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main Content Area */}
            <main className="md:pl-64 min-h-screen pb-20 md:pb-0 flex flex-col">
                <div className="max-w-5xl mx-auto md:p-8 p-4 flex-1 w-full">
                    {children}
                </div>
                {/* Global Footer */}
                <footer className="text-center py-6 text-xs text-[#4A443F] mt-auto border-t border-[#FDF2E9]">
                    © {new Date().getFullYear()} Axis Lab. All rights reserved.
                </footer>
            </main>

            <BottomNav />
        </div>
    );
}
