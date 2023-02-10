// 暴露出页面模块

import React, { Suspense, useState, useEffect } from 'react';
import Render from './Render';

// json 懒加载
const withRenderDSL = (RenderComponent, dslModule) => {
  const Page = () => {
    const [dsl, setDsl] = useState();
    useEffect(() => {
      dslModule.then((res) => setDsl(res));
    }, []);

    if (!dsl) return null;
    return (
      <Suspense>
        <RenderComponent dsl={dsl} />
      </Suspense>
    );
  };
  Page.loadable = true;
  return Page;
};

// dsl页面, 后续通过 cli 自动注入
export const DemoPage = withRenderDSL(Render, import('./dsls/demo1.json'));

// 搜索页
export const SearchPage = withRenderDSL(Render, import('./dsls/searchPage.json'));
