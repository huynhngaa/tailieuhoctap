<template>
    <div class="app-container">
        <el-button @click="dialogFormVisible = true" type="primary" :icon="Plus">Thêm lớp</el-button>
       
        <el-table :data="paginatedData" style="width: 100%">
            <el-table-column label="STT" prop="kl_ma" />
            <el-table-column label="Khối lớp">

                <template #default="scope">
                    <div v-if="editingRow === scope.$index">
                        <el-input v-model="editName" size="small" />
                    </div>
                    <div v-else>
                        {{ scope.row.kl_ten }}
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Tìm kiếm khối lớp" />
                </template>
                <template #default="scope">
                    <el-button type="primary" v-if="editingRow === scope.$index" size="small"
                        @click="handleConfirm(scope.row)">
                        Xác nhận
                    </el-button>
                    <el-button type="warning" plain v-else size="small" @click="handleEdit(scope.$index, scope.row)">
                        Chỉnh sửa
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Xoá
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5,10, 20, 50, 100]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
         </div>
        <el-dialog v-model="dialogFormVisible" title="Thêm khối lớp" width="500">
            <el-form :model="form">
                <el-form-item label="Tên" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
               
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="handleAdd">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getListKhoiLop,addKhoiLop, updateKhoiLop, deleteKhoiLop } from '@/api/khoilop';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const search = ref('');
const tableData = ref([]);
const editingRow = ref(null);
const editName = ref('');
const dialogFormVisible = ref(false)
const currentPage = ref(1);
const pageSize = ref(10);
const form = ref({
    name: '',
  
})

const filterTableData = computed(() =>
    tableData.value.filter(
        data =>
            !search.value ||
            data.kl_ten.toLowerCase().includes(search.value.toLowerCase())
    )
);
const paginatedData  = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filterTableData.value.slice(start, end);
});
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
};
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const data = await getListKhoiLop();
        tableData.value = data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
        loading.value = false;
    }
});
const handleAdd = async () => {
    if (form.value.name.trim() !== '') {  // Kiểm tra xem trường nhập liệu có rỗng sau khi loại bỏ khoảng trắng hay không
        try {
            const response = await addKhoiLop({ kl_ten: form.value.name });

            if (response.success) {
                tableData.value.push(response.data); // Thêm dữ liệu mới vào bảng
                dialogFormVisible.value = false;
                ElMessage({
                    message: 'Thêm thành công!',
                    type: 'success',
                });
            } else {
                console.error('Lỗi khi thêm:', response.message);
                ElMessage.error('Có lỗi xảy ra.')
            }
        } catch (error) {
            console.error('Lỗi khi thêm:', error);
            ElMessage.error('Có lỗi xảy ra!')
        }
    } else {
        console.error('Lỗi: Không được để trống!');
        ElMessage.error('Không được để trống!');
    }
};


const handleEdit = (index, row) => {
    editingRow.value = index;
    editName.value = row.kl_ten;
};

const handleConfirm = async row => {
    if (editingRow.value !== null) {
        try {
            const updatedRow = { ...row, kl_ten: editName.value };
            console.log('Cập nhật:', updatedRow);

            const response = await updateKhoiLop(updatedRow);
            console.log('Kết quả phản hồi:', response);

            if (response.success) {
                tableData.value = tableData.value.map((item, index) =>
                    index === editingRow.value ? updatedRow : item
                );
                editingRow.value = null;
                editName.value = '';
                ElMessage({
                    message: 'Cập nhật thành công',
                    type: 'success',
                })
            } else {
                console.error('Lỗi khi cập nhật:', response.message);
                ElMessage.error('Có lỗi xảy ra.')
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
        }
    }
};



const handleDelete = async (index, row) => {
    try {
        const response = await deleteKhoiLop(row.kl_ma);
        if (response.success) {
            tableData.value = tableData.value.filter((item, i) => i !== index);
            ElMessage({
                message: 'Xoá thành công!',
                type: 'success',
            })
        } else {
            console.error('Lỗi khi xóa:', response.message);
            ElMessage.error('Không thể xoá lớp này!')
        }
    } catch (error) {
        console.error('Lỗi khi xóa:', error);
        ElMessage.error('Có lỗi xảy ra!')
    }
};


</script>
<style>
.pagination-container {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center; 
    padding: 10px 20px;
    background: white;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}</style>