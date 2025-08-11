import { Link } from "@tanstack/react-router";
import {
  BookMarkedIcon,
  CalendarClockIcon,
  ClipboardCheckIcon,
  DatabaseIcon,
  SmartphoneIcon,
  UsersIcon,
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
} from "./ui/sidebar";

interface ItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const dataItems: ItemProps[] = [
  {
    title: "Manajemen Data",
    href: "/data-management/batches",
    icon: <DatabaseIcon />,
  },
  {
    title: "Manajemen Data Guru",
    href: "/teacher-management",
    icon: <UsersIcon />,
  },
  {
    title: "Manajemen Mata Pelajaran",
    href: "/subject-management",
    icon: <BookMarkedIcon />,
  },
  {
    title: "Manajemen Akun Siswa",
    href: "/student-account-management",
    icon: <SmartphoneIcon />,
  },
];

const attendanceItems: ItemProps[] = [
  {
    title: "Presensi Kehadiran",
    href: "/attendance/general",
    icon: <CalendarClockIcon />,
  },
  {
    title: "Presensi Mata Pelajaran",
    href: "/attendance/subject/batches",
    icon: <ClipboardCheckIcon />,
  },
];

export const AppSidebar = () => {
  return (
    <>
      <Sidebar>
        <SidebarContent>
          {/* data */}
          <SidebarGroup>
            <SidebarGroupLabel>Data</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dataItems.map((item, index) => (
                  <SidebarMenuItem key={"data-item-" + index}>
                    <SidebarMenuButton asChild>
                      <Link to={item.href}>
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* attendance */}
          <SidebarGroup>
            <SidebarGroupLabel>Presensi</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {attendanceItems.map((item, index) => (
                  <SidebarMenuItem key={"attendance-item-" + index}>
                    <SidebarMenuButton asChild>
                      <Link to={item.href}>
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};
