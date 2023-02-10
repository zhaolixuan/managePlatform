import { useMemo, useCallback } from 'react';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import qs from 'qs';

export default function useRouter() {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const push = useCallback(
    (to) => {
      if (_.isObject(to)) {
        history.push({
          pathname: to.path,
          search: qs.stringify(to.query),
        });
      } else {
        history.push(to);
      }
    },
    [history],
  );

  return useMemo(
    () => ({
      params,
      match,
      location,
      history,
      push,
      replace: history.replace,
      pathname: location.pathname,
      query: qs.parse(location.search, { ignoreQueryPrefix: true }),
    }),
    [params, match, location, history],
  );
}
