import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Welcome } from '.';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome />);
