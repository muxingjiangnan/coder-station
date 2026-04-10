import AdminController from '@/services/admin';

export default {
  // 命名空间
  namespace: 'admin',
  // 仓库数据
  state: {
    adminList: [], // 存储所有的管理员信息
    adminInfo: null, // 存储当前登录的管理员信息
  },
  // 同步更新仓库状态数据
  reducers: {
    initAdminList(state, { payload }) {
      const newState = { ...state };
      newState.adminList = payload;
      return newState;
    },
    deleteAdmin(state, { payload }) {
      const newState = { ...state };
      const index = newState.adminList.indexOf(payload);
      const arr = [...newState.adminList];
      arr.splice(index, 1);
      newState.adminList = arr;
      return newState;
    },
    /**
     * 更新管理员信息
     *
     */
    updateAdmin(state, { payload }) {
      const newState = { ...state };
      for (let i = 0; i < newState.adminList.length; i++) {
        if (newState.adminList[i]._id === payload.adminInfo._id) {
          for (const key in payload.newAdminInfo) {
            if (Object.prototype.hasOwnProperty.call(payload.newAdminInfo, key)) {
              newState.adminList[i][key] = payload.newAdminInfo[key];
            }
          }
          break;
        }
      }
      return newState;
    },

    /**
     * 新增管理员
     */
    addAdmin(state, { payload }) {
      const newState = { ...state };
      const arr = [...newState.adminList]
      arr.push(payload);
      newState.adminList = arr;
      return newState;
    },
  },
  // 处理异步副作用
  effects: {
    // 初始化管理员列表
    *_initAdminList(_, { put, call }) {
      // 和服务器进行通信，拿到所有的数据
      const { data } = yield call(AdminController.getAdmin);
      // 调用 reducer 更新本地仓库
      yield put({
        type: 'initAdminList',
        payload: data,
      });
    },
    // 删除一个管理员
    *_deleteAdmin({ payload }, { put, call }) {
      // 和服务器进行通信，删除服务器上的数据
      yield call(AdminController.deleteAdmin, payload._id);
      // 更新本地仓库
      yield put({
        type: 'deleteAdmin',
        payload,
      });
    },
    // 修改管理员状态
    *_editAdmin({ payload }, { put, call }) {
      yield call(
        AdminController.editAdmin,
        payload.adminInfo._id,
        payload.newAdminInfo,
      );
      yield put({
        type: 'updateAdmin',
        payload,
      });
    },

    /**
     * 新增管理员
     * @param {*} param0
     * @param {*} param1
     */
    *_addAdmin({ payload }, { put, call }) {
      const { data } = yield call(AdminController.addAdmin, payload);
      if(data) yield put({ type: 'addAdmin', payload: data });
    },
  },
};
