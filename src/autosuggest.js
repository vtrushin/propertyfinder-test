import React from 'react';
import Autosuggest from 'react-autosuggest';
import theme from './autosuggest.css';

export default props => <Autosuggest {...props} theme={theme} />;
