import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  Shield,
  Key,
  Scale,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    single: true,
  },
  {
    title: "Tenant Management",
    icon: Building2,
    items: [
      { title: "Tenants", url: "/tenants" },
      { title: "Tenant Settings", url: "/tenant-settings" },
    ],
  },
  {
    title: "Organization Management",
    icon: Users,
    items: [
      { title: "Organizations", url: "/organizations" },
      { title: "Organization Profile", url: "/org-profile" },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      { title: "Users", url: "/users" },
      { title: "User Roles", url: "/user-roles" },
      { title: "My Profile", url: "/profile" },
    ],
  },
  {
    title: "Access Control",
    icon: Shield,
    items: [
      { title: "Roles", url: "/roles" },
      { title: "Privileges", url: "/privileges" },
    ],
  },
  {
    title: "Legal Entities",
    url: "/legal-entities",
    icon: Scale,
    single: true,
  },
  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: BarChart3,
    single: true,
  },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openGroups, setOpenGroups] = useState<string[]>([
    "Tenant Management",
    "Organization Management", 
    "User Management",
    "Access Control"
  ]);

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: any[]) => items?.some(item => isActive(item.url));
  
  const getNavCls = (active: boolean) =>
    active 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:bg-sidebar-accent/90" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  return (
    <Sidebar className={`${isCollapsed && !isMobile ? "w-14" : "w-64"} bg-sidebar border-r border-sidebar-border`} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">UserMS</h2>
              <p className="text-xs text-sidebar-foreground/70">Enterprise Edition</p>
            </div>
          </div>
        )}
        {isCollapsed && !isMobile && (
          <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
        )}
        {!isMobile && <SidebarTrigger className="ml-auto h-6 w-6 text-sidebar-foreground hover:text-sidebar-accent-foreground" />}
      </div>

      <SidebarContent className="px-2 bg-sidebar">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.single ? (
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url!} 
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavCls(isActive)}`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <Collapsible
                    open={openGroups.includes(item.title) && (!isCollapsed || isMobile)}
                    onOpenChange={() => !isCollapsed && toggleGroup(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className={`w-full justify-between px-3 py-2 rounded-md transition-colors ${
                          isGroupActive(item.items!) 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {(!isCollapsed || isMobile) && <span className="truncate">{item.title}</span>}
                        </div>
                        {(!isCollapsed || isMobile) && (
                          openGroups.includes(item.title) 
                            ? <ChevronDown className="w-4 h-4 flex-shrink-0" />
                            : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {(!isCollapsed || isMobile) && (
                      <CollapsibleContent>
                        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                          {item.items!.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild>
                              <NavLink 
                                to={subItem.url} 
                                className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${getNavCls(isActive)}`}
                              >
                                <span className="w-2 h-2 rounded-full bg-current opacity-50 flex-shrink-0" />
                                <span className="truncate">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}