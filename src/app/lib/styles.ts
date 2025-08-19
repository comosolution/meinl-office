export const defaultBorder = "1px solid var(--mantine-color-gray-9)";
export const navLink = (isCollapsed: boolean) =>
  `flex items-center ${
    isCollapsed ? "justify-center px-9" : "justify-start"
  } py-3 transition-all duration-300`;
