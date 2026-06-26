export function getAuthenticatedHome(user) {
  if (!user) return "/login";
  return user.role === "ADMIN" ? "/admin" : "/dashboard";
}
