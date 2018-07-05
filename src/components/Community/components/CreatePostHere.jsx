import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
// import styled, { css } from 'styled-components';
import { format } from '../../../utils';
import { CreatePostButton } from '../../Post/components';
import strings from '../../../lang';

const CreatePostHere = propsVar => (
  <div style={{
 margin: '20px 0', padding: 20, backgroundColor: propsVar.muiTheme.paper.backgroundColor, textAlign: 'center',
}}>
    <div className="text-normal" style={{ color: propsVar.muiTheme.palette.textColor }}>
      <b>{format(strings.paragraph_say_something, propsVar.name || '')}</b>
    </div>
    <div style={{ maxWidth: 300, margin: 'auto' }}>
      <CreatePostButton />
    </div>
  </div>
);

export default muiThemeable()(CreatePostHere);
