import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;