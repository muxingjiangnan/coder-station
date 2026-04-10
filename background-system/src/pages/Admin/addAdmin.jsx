import { PageContainer } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import AdminForm from './components/adminForm'
import { useDispatch, useNavigate, useSelector } from '@umijs/max';
import { message } from 'antd';

function addAdmin(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminList } = useSelector((state) => state.admin);
    
    // 初始化管理员列表数据
    useEffect(() => {
        if (!adminList.length) {
            dispatch({
                type: 'admin/_initAdminList',
            });
        }
    }, [adminList, dispatch]);
  const [newAdminInfo, setNewAdminInfo] = useState({
    loginId: '',
    logonPwd: '',
    nickname: '',
    avatar: '',
    permission: 2, // 默认是普通管理员
  });

  /**
   * 用户点击确认
   */
  function submitHandle() {
    dispatch({
        type:"admin/_addAdmin",
        payload:newAdminInfo,
    });
    message.success('添加成功！')
    navigate('/admin/adminList')
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        <AdminForm
          type="add"
          adminInfo={newAdminInfo}
          setAdminInfo={setNewAdminInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default addAdmin;
