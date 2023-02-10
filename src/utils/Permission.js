/*
验证理由权限
path:路由
*/
export function verificationPath() {
  let path = window.location.hash.split('#')[1].split('?')[0];
  let permisData = JSON.parse(sessionStorage.getItem('manageMenus')).children[0].children;
  return handelData(permisData, path);
}

function handelData(data, path) {
  if (!data.length) return;
  for (let index = 0; index < data.length; index++) {
    let item = data[index];
    if (item.frontendUrl == path) {
      return item.children;
    } else {
      if (item.children.length) {
        let arr =  handelData(item.children, path);
        if (arr) return arr 
      }
    }
  }
}
