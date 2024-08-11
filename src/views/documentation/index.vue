<template>
  <div class="app-container">
  
    <el-card  class="bv-card" v-for="item in paginatedTableData" :key="item.bv_ma">
      <router-link :to="{ name: 'Detail', params: { bv_ma: item.bv_ma } }">
      <el-row >
        <el-col :xs="8" :sm="2" :md="1" :lg="1" :xl="1">
          <div>
            <el-avatar  v-if="item.nd_hinh" :src="`/public/img/${item.nd_hinh}`" />            <el-avatar v-else>{{ item.nd_username }}</el-avatar>
          </div>
        </el-col>
        <el-col :xs="4" :sm="10" :md="11" :lg="11" :xl="11">
          <div class="noidung">
            <p class="title"><b> {{ item.bv_tieude }}</b></p>
            <p class="text-item"><i><b>Danh mục: </b></i>{{ item.dm_ten }}</p>
            <p class="text-item"><i><b>Môn học: </b></i>{{ item.mh_ten }}</p>
            <p class="text-item"><i><b>Khối lớp: </b></i>{{ item.kl_ten }}</p>
            <p class="text-item"><i><b>Tác giả: </b></i> <b class="name">{{ item.nd_hoten }}</b></p>
           <p><el-icon><View /></el-icon> <el-icon><ChatSquare /></el-icon> <el-icon><Star /></el-icon></p>


          </div>
        </el-col>

      </el-row>
    </router-link>
    </el-card>
  
    <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="totalItems"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onBeforeMount } from 'vue'
import { getListBaiViet } from '@/api/baiviet'
import type { UploadFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
const router = useRouter()
interface User {
  bv_ma: number,
  nd_username: string,
  bv_tieude: string,
  bv_noidung: string,
  bv_ngaydang: Date,
  bv_luotxem: number,
  bv_diemtrungbinh: number,
  nd_hoten: string,
  nd_hinh: String,
  dm_ten: string,
  mh_ten: string,
  dg_diem: number,
  kl_ten: string,
  current_timestamp: Date,
  slbl: number,
  luotxem: number
}

const dialogFormVisible = ref(false)
const dialogDetail = ref(false)
const centerDialogVisible = ref(false)
const formLabelWidth = '140px'
const search = ref('')
const tableData = ref<User[]>([])
const selectedRow = ref<User | null>(null)
const currentPage = ref(1)
const pageSize = ref(5)
const background = ref(false)
const disabled = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const loading = ref(false)




onBeforeMount(async () => {
  loading.value = true
  try {
    const data = await getListBaiViet()
    tableData.value = data
  } catch (error) {
    console.error('Lỗi khi lấy API:', error)
  } finally {
    loading.value = false
  }

})

const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.bv_tieude.toLowerCase().includes(search.value.toLowerCase())
  )
)

const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filterTableData.value.slice(start, end)
})

const totalItems = computed(() => filterTableData.value.length)

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const handleSubmit = () => {
  const id = selectedRow?.value?.bv_ma;
  if (!id) {
    const data = selectedRow?.value;
    if (data) {
      tableData.value.unshift(data);
      dialogFormVisible.value = false;
      selectedRow.value = null;
    }
  } else {
    const index = tableData.value.findIndex((row) => row.bv_ma === id);
    if (index > -1) {
      tableData.value.splice(index, 1, selectedRow.value!);
      dialogFormVisible.value = false;
      selectedRow.value = null;
    } else {
      console.error('Không tìm thấy dữ liệu để sửa:', id);
    }
  }
}

const open = () => {
  dialogFormVisible.value = false;
  ElMessageBox.confirm(
    'Xác nhận chỉnh sửa',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      center: true,
    }
  )
    .then(() => {
      handleSubmit()
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

const openDetailModal = (row: User) => {
  selectedRow.value = { ...row }
  dialogDetail.value = true
}

const openEditModal = (row: User) => {
  selectedRow.value = { ...row }
  dialogFormVisible.value = true
}

const openDeleteModal = (row: User) => {
  selectedRow.value = { ...row }
  centerDialogVisible.value = true
}

const confirmDelete = () => {
  console.log('Deleting row:', selectedRow.value?.bv_ma);
  centerDialogVisible.value = false
}
</script>

<style scoped>
.bv-card {
  margin-bottom: 10px;
  /* padding-top: 0 !important; */
}

.el-card__body {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.el-avatar--circle{
  margin-top: 20px !important;
}
.noidung{
  margin-left: 10px;
}
.title{
  font-size: 1rem;
}
.text-item{
  font-size: 13px
}
.name{
  font-size: 14px;
}
</style>