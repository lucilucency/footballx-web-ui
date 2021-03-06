import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { debounce } from 'lodash/fp';
import TextField from 'material-ui/TextField';
import querystring from 'querystring';
import strings from '../../lang';
import { getSearchResultAndPros, setSearchQuery } from '../../actions';
import ui from '../../theme';

class SearchForm extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    const params = querystring.parse(window.location.search.substring(1));
    const { pathname } = window.location;
    if (params.q && pathname === '/search') {
      this.props.dispatchSearch(params.q);
      this.setState({
        query: params.q,
      });
    }
  }

  debouncedSetQuery = () => {
    debounce(this.props.dispatchSetQuery, 100);
  };

  formSubmit = (e) => {
    const { query } = this.state;
    e.preventDefault();
    this.props.history.push(`/search?q=${query}`);
    this.props.dispatchSearch(query);
  };

  handleChange = (e) => {
    const { pathname } = window.location;
    const { value } = e.target;

    this.setState({
      query: value,
    });

    if (pathname === '/search') {
      this.debouncedSetQuery(value);
    }
  };

  render() {
    return (
      <form onSubmit={this.formSubmit}>
        <TextField
          hintText={strings.search_title}
          value={this.state.query}
          onChange={this.handleChange}
          fullWidth
          underlineFocusStyle={{
            borderColor: ui.linkColor,
            bottom: '-4px',
            left: '-40px',
            width: 'calc(100% + 40px)',
          }}
          underlineStyle={{ borderColor: 'transparent' }}
          hintStyle={{
            fontSize: ui.fontSizeSmall,
            lineHeight: '18px',
            whiteSpace: 'nowrap',
            color: ui.alternateTextColorVariant1,
          }}
        />
      </form>
    );
  }
}

SearchForm.propTypes = {
  dispatchSearch: PropTypes.func,
  dispatchSetQuery: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

// const mapStateToProps = (state) => {
//   const { error, loading, done } = state.app.search;
//   return {
//     loading,
//     done,
//     error,
//     query,
//     data: searchResults,
//   };
// };

const mapDispatchToProps = dispatch => ({
  dispatchSearch: query => dispatch(getSearchResultAndPros(query)),
  dispatchSetQuery: query => dispatch(setSearchQuery(query)),
});

export default withRouter(connect(null, mapDispatchToProps)(SearchForm));
