export default (initialState) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  if (initialState) {
    return {
      SuperAdmin: initialState.adminInfo?.permission === 1,
      NormalAdmin:
        initialState.adminInfo?.permission === 1 ||
        initialState.adminInfo?.permission === 2,
    };
  } else {
    return {
      SuperAdmin: false,
      NormalAdmin: false,
    };
  }

  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  // return {
  //   canSeeAdmin,
  // };
};
