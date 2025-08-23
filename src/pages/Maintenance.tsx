
import TopNavigation from '@/components/TopNavigation';
import MaintenancePage from '@/components/maintenance/MaintenancePage';
import { BackButton } from '@/components/ui/back-button';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="container mx-auto px-4 pt-6">
        <BackButton />
      </div>
      <MaintenancePage />
    </div>
  );
};

export default Maintenance;
