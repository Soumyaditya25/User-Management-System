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
  const { state } = useSidebar();
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
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground";

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">UserMS</h2>
              <p className="text-xs text-muted-foreground">Enterprise Edition</p>
            </div>
          </div>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.single ? (
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url!} className={getNavCls(isActive(item.url!))}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <Collapsible
                    open={openGroups.includes(item.title)}
                    onOpenChange={() => toggleGroup(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className={`w-full justify-between ${
                          isGroupActive(item.items!) 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className="w-4 h-4" />
                          {!isCollapsed && <span className="ml-2">{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          openGroups.includes(item.title) 
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent>
                        <div className="ml-4 mt-1 space-y-1">
                          {item.items!.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild>
                              <NavLink 
                                to={subItem.url} 
                                className={`text-sm ${getNavCls(isActive(subItem.url))}`}
                              >
                                <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                                <span>{subItem.title}</span>
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
