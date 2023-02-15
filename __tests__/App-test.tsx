/**
 * @format
 */

import 'react-native';
import React from 'react';
import {render, fireEvent, cleanup } from '@testing-library/react-native';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.useFakeTimers();
afterEach(cleanup);

describe('App', () => {
  it('', () => {
    renderer.create(<App />);
  });
});



