 import { RiUser3Line, RiSettings4Line, RiFileListLine, RiApps2AiLine, RiAddCircleLine, RiArrowDownSLine } from "react-icons/ri";
import { GoHome, GoOrganization } from "react-icons/go";
import { PiUsersFourLight } from "react-icons/pi";
import { IoIosTrendingUp } from "react-icons/io";

export const navItems = [
        { path: "/dashboard/home", name: "Getting Started", icon: GoHome },
        { path: "/dashboard/insights", name: "Activity Insights", icon: IoIosTrendingUp },
        // { path: "/dashboard/organization", name: "Organization", icon: GoOrganization },
        { path: "/dashboard/apps", name: "Apps", icon: RiApps2AiLine },
        { path: "/dashboard/users", name: "Users", icon: PiUsersFourLight },
        { path: "/dashboard/settings/organization", name: "Settings", icon: RiSettings4Line },
    ];