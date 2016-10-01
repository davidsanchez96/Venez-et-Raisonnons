import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import immutableTransform from 'redux-persist-transform-immutable';
import { persistStore } from 'redux-persist';
import {
  AsyncStorage,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import routes from './routes';
import configureStore from './redux/store';

export const store = configureStore();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignSelf: 'center'
  }
});


class App extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = { rehydrated: false };
  }

  componentWillMount() {
    persistStore(store, {
      storage: AsyncStorage,
      transforms: [immutableTransform()]
    }, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (!this.state.rehydrated) {
      return (
        <View style={styles.container}>
          <ActivityIndicator style={styles.centered} />
        </View>
      );
    }
    return (
      <Provider store={store}>
        { routes(store) }
      </Provider>
    );
  }
}

export default App;
