const hasPermission = (user, requiredPermissions) => {
  if (!requiredPermissions.length) return true;

  return requiredPermissions.every((perm) => user?.permissions?.includes(perm));
};

export default hasPermission;
