export const defaultBorder = "1px solid rgba(0, 0, 0, 0.2)";
export const navLink = (isCollapsed: boolean) => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "flex-start",
    paddingInline: isCollapsed ? "2.25rem" : "0.8rem",
    paddingBlock: "0.6rem",
    transition: "all 300ms ease",
  };
};
