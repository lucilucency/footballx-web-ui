import React from 'react';
import PropTypes from 'prop-types';
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

const GroupLandingPage1 = ({
  // muiTheme,
  registerMembership, user,
}) => (
  <Styled>
    <div className="font-small">
      <div className="font-big">Xin chào {user.fullname}</div>
      <Divider />
      <p>
        MUSVN đã nhận được thông tin đăng ký thành viên chính thức mùa giải 2018/19 của bạn. <br />
        <b>Mã giao dịch của bạn là <span className="text-normal">{registerMembership.id}</span>.</b>
        <br />
        Bạn vui lòng hoàn tất chuyển khoản phí thành viên trong vòng 48 giờ để hoàn tất đăng ký.
      </p>
      <p>
        Thông tin chuyển khoản <br />
        <ul>
          <li>Nội dung chuyển khoản: <span className="text-normal"><b>MUSVN-{registerMembership.id}</b></span></li>
          <li>Ngân hàng: Một trong hai ngân hàng sau:</li>
          <ul>
            <li>
              1. Ngân hàng BIDV: 120-10-00-677970-0 - Chi nhánh: Sở giao dịch 1 <br />
              Chủ tài khoản: Trịnh Thanh Hòa
            </li>
            <li>
              2. Ngân hàng Vietcombank: 0851000019106 - Chi nhánh: Hà Thành <br />
              Chủ tài khoản: Trịnh Thanh Hòa
            </li>
          </ul>
        </ul>
      </p>

      <ul>
        <i>
          Lưu ý:
          <li>1. MUSVN không chấp nhận chuyển khoản qua ATM</li>
          <li>2. MUSVN không chấp nhận các giao dịch không có nội dung hoặc nội dung chuyển khoản không đúng cú pháp: MUSVN-mã giao dịch</li>
        </i>
      </ul>
      <p>
        Mọi thông tin chi tiết bạn vui lòng xem thêm tại MUSVN trên website: footballx.live <br />
        Xin cám ơn bạn đã đồng hành cùng MUSVN.
      </p>
      <p>Trân trọng.</p>
    </div>
  </Styled>
);

GroupLandingPage1.propTypes = {
  user: PropTypes.object,
  registerMembership: PropTypes.object,
  /**/
  // muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupLandingPage1));
