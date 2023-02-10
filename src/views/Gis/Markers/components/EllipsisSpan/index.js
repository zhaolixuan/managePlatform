import { Tooltip } from '@jd/find-react';
import React, { PureComponent } from 'react';
import getType from 'uc-fun/src/getType';
import stringRealLen from 'uc-fun/src/stringRealLen';
import stringEllipsis from 'uc-fun/src/stringEllipsis';

class EllipsisSpan extends PureComponent {
  render() {
    const { width, title, renderTitle, limit, className, style = {}, onClick, render, ...props } = this.props;
    const outOfRange = stringRealLen(title) > limit;
    const limitTitle = stringEllipsis(title, limit);
    const content =
      getType(render) === 'Function' ? (
        render(limitTitle)
      ) : (
        <Tooltip title={title}>
          <span
            className={className}
            style={{ maxWidth: width, ...style }}
            onClick={() => onClick && onClick()}
          >
            {limitTitle}
          </span>
        </Tooltip>
      );

    return outOfRange ? (
      <Tooltip title={renderTitle ? renderTitle() : title}  {...props} overlayStyle={{ zIndex: '999999' }}>
        {content}
      </Tooltip>
    ) : (
      content
    );
  }
}

export default EllipsisSpan;
