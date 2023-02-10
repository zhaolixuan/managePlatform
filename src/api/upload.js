import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';
const UploadCenterAdapter = getRequestInstance(domains.managerBaseUrl);
// 文件上传
export const fileUpload = async (params) => await UploadCenterAdapter.post(`/oss/upload/${params.type}`, params.file);

// 文件删除
export const deleteFile = async (params) =>
  await UploadCenterAdapter.post(`/oss/delete/${params.type}?fileName=${params.fileName}`);
