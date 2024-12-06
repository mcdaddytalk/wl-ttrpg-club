"use client";

import { 
    Drawer, 
    DrawerContent, 
    DrawerTrigger
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export const AdminDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 space-y-4">
          <a href="/admin/members" className="block text-lg font-semibold">
            Members
          </a>
          <a href="/admin/roles" className="block text-lg font-semibold">
            Roles
          </a>
          <a href="/admin/settings" className="block text-lg font-semibold">
            Settings
          </a>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
