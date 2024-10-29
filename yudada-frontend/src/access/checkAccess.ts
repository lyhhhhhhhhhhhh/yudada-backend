import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查权限 （判断当前用户是否具有某个权限）
 *
 * 整体逻辑：
 *  首先获取当起啊登录用户具有的权限 （若为登录 权限则为NOT_LOGIN）
 *    获取当前菜单所需的权限 若不需要权限 则直接返回true
 *    若只需用户权限 则判断当前登录用户是否为登录用户
 *    若需要管理员权限 则判断当前用户的权限是否是管理员 若不是返回false
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN
) => {
  //获取当前登录用户具有的权限（如果loginUser 则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  //如果用户要登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    //如果用户没登录 那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  //如果管理员才能访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果不是管理员则表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
    return true;
  }
};

export default checkAccess;
