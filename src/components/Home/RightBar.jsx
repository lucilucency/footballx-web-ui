import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SuggestedCommunities } from '../User/components/index';
import { RightTray, SmallPaper } from '../../utils/index';
import strings from '../../lang/index';
import Container from '../Container';
import AboutX from '../About/Hero';
import AboutXFooter from '../About/Footer';
import HallOfFame from '../Game/HallOfFame';

const HomeRightBar = (props) => {
  const { isLoggedIn } = props;
  return (
    <RightTray>
      <SmallPaper style={{ padding: 0 }}>
        <AboutX isLoggedIn={isLoggedIn} />
      </SmallPaper>
      <Container
        title={strings.label_hall_of_fame}
        style={{
          fontSize: '12px',
        }}
      >
        <SmallPaper>
          <HallOfFame />
        </SmallPaper>
      </Container>

      {isLoggedIn && (
        <Container
          title={strings.label_suggested_community}
        >
          <SmallPaper>
            <SuggestedCommunities />
          </SmallPaper>
        </Container>
      )}
      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

HomeRightBar.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
});

export default connect(mapStateToProps, null)(HomeRightBar);
