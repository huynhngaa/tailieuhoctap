import axios from 'axios';

const API = 'http://127.0.0.1:8000';
export function getListBaiViet() {
  return axios.get(API+'/listbaiviet.php')
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to fetch users:', error);
      throw error;
    });
}
export function getBaiVietDetail(bvMa) {
  return axios.get(`${API}/baivietdetail.php`, {
    params: { bv_ma: bvMa }
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Failed to fetch details:', error);
    throw error;
  });
}
export async function getRelatedPosts (bv_ma, dm_ma) {
    const response = await axios.get(`${API}/baivietlienquan.php?bv_ma=${bv_ma}&dm_ma=${dm_ma}`);
    return response.data;
};

export function getListBaiVietOfUser(ndUsername) {
    return axios.get(`${API}/listbaivietcuanguoidung.php`, {
      params: { nd_username: ndUsername }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to fetch details:', error);
      throw error;
    });
  }