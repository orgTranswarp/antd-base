import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateTo, fetchPostsIfNeeded } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';


import Pagination from '../../pagination/Pagination';

class App extends Component {
  constructor(props) {
    super(props);
    // console.log('inside constructor of app: props: ', props)
    // this.onPagination = this.onPagination.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedReddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedReddit.pageNumber));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReddit.pageNumber !== this.props.selectedReddit.pageNumber) {
      const { dispatch, selectedReddit } = nextProps;
      console.log('inside componentWillReceiveProps');
      dispatch(fetchPostsIfNeeded(selectedReddit.pageNumber));
    }
  }

  onPagination(argus) {
    this.props.dispatch( navigateTo(argus) );
    console.log('what is that:', this.props );
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props;
    const isEmpty = posts.length === 0;
    const pageNumber = selectedReddit.pageNumber;
    const message = isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>;

    // console.log('inside render of app: props: ', this.props)
    return (
      <div>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span> }
            
          {!isFetching &&
            <a
              href="#"
              onClick={this.handleRefreshClick}
            >
              Refresh
            </a>
          }
        </p>

          {isEmpty ? message : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
          }
        <Pagination onPagination={this.onPagination.bind(this)} defaultCurrent={pageNumber} total={50} />
        
      </div>
    );
  }
}

App.propTypes = {
  // pageNumber: PropTypes.number.isRequired,
  selectedReddit: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { postsBypageNumber, selectedReddit } = state;

  const {
    isFetching,
    lastUpdated,
    items: posts,
  } = postsBypageNumber[selectedReddit.pageNumber] || {
    isFetching: true,
    items: [],
  };

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated,
  };
}


export default connect(mapStateToProps)(App);

// export default connect(
//   state => ({ pageNumber: state.selectedReddit.pageNumber }),
//   dispatch => ({
//     navigateTo: navigateTo => dispatch(navigateTo(state.selectedReddit.pageNumber)),
//     fetchPostsIfNeeded: fetchPostsIfNeeded => dispatch(fetchPostsIfNeeded(state.selectedReddit.pageNumber))
//   }),

// )(App);