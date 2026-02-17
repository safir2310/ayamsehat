import dynamic from 'next/dynamic'

// Dynamically import UserDashboard with SSR disabled to prevent build-time errors
const UserDashboard = dynamic(() => import('@/components/UserDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Memuat dashboard...</p>
      </div>
    </div>
  ),
})

export default function DashboardPage() {
  return <UserDashboard />
}
