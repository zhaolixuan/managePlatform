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
        <span
          className={className}
          style={{ maxWidth: width, wordBreak: 'break-all', ...style }}
          onClick={() => onClick && onClick()}
        >
          {limitTitle}
        </span>
      );

    return outOfRange ? (
      <Tooltip title={renderTitle ? renderTitle() : title} {...props}>
        {content}
      </Tooltip>
    ) : (
      content
    );
  }
}

export default EllipsisSpan;
