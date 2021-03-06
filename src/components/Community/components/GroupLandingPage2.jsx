import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/muiThemeable';
// import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import styled from 'styled-components';
// import constants from '../../constants';
// import { format } from '../../../utils/index';
// import strings from '../../../lang';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

const GroupLandingPage2 = ({
  // muiTheme,
  user,
  group_memberships,
  registerMembership,
}) => {
  const userGroupMembership = registerMembership && group_memberships &&
    group_memberships.length &&
    group_memberships.find(el => el.group_membership_id === registerMembership.group_membership_id);
  return (
    <Styled>
      <div>
        <div className="text-big">MUSVN xin trân trọng thông báo</div>
        <Divider />
        <p>
          {user.fullname} là thành viên chính thức của MUSVN mùa bóng 2018/2019.<br />
        </p>
        {/* //TODO image */}
        <p>
           Bạn đã là thành viên chính thức của MUSVN mùa bóng 2018/2019 với mã số {userGroupMembership && userGroupMembership.code}
        </p>
        <p>
          Hộp quà sẽ được gửi đến địa chỉ bạn đã điền trong form đăng kí kể từ ngày 20/8/2018 <br />
          Hãy nhanh tay truy cập ngay vào <a href="https://footballx.live/r/MUSVN">https://footballx.live/r/MUSVN</a> hoặc tải ứng dụng trên điện thoại để trải nghiệm ngôi nhà mới của MUSVN ngay nào!
        </p>
      </div>
    </Styled>
  );
};

GroupLandingPage2.propTypes = {
  user: PropTypes.object,
  group_memberships: PropTypes.array,
  registerMembership: PropTypes.object,
  /**/
  // muiTheme: PropTypes.object,
};

const mapStateToProps = state => ({
  group_memberships: state.app.metadata.data.group_memberships,
  registerMembership: state.app.metadata.data.registerMembership,
});

export default connect(mapStateToProps)(getMuiTheme()(GroupLandingPage2));
