<template>
    <div class="app-container">
        <el-button @click="dialogFormVisible = true" type="primary" :icon="Plus">Thêm môn học</el-button>

        <el-table :data="filterTableData" style="width: 100%; height: 80vh;">
            <el-table-column label="STT" prop="nd_username" width="150" />
            <el-table-column label="Hình">
                <template v-slot="scope">
                    <el-avatar v-if="scope.row.nd_hinh != ''" :src="`/public/img/${scope.row.nd_hinh}`" />
                    <el-avatar v-else :icon="UserFilled" />
                </template>
            </el-table-column>
            <el-table-column label="Họ Tên" prop="nd_hoten" width="210" />
            <el-table-column label="Username" prop="nd_username" width="150" />
            <el-table-column label="Giới tính" prop="nd_gioitinh" width="150" :formatter="formatGender" />
            <el-table-column label="Ngày sinh" prop="nd_ngaysinh" width="150" />
            <el-table-column label="Vai trò" prop="vt_ten" width="150">
                <template #default="scope">
                    <el-tag :key="scope.row.vt_ten" :type="getTagType(scope.row.vt_ten)" effect="light" round>
                        {{ scope.row.vt_ten }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Ngày tạo" prop="nd_ngaytao" width="180" />

            <el-table-column fixed="right" align="right" min-width="180">
                <template #default="scope">
                    <el-button type="warning" plain size="small" @click="openEditDialog(scope.row)">
                        Chỉnh sửa
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Xoá
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- Form Thêm -->
        <el-dialog v-model="dialogFormVisible" title="Thêm người dùng" width="500">
            <el-form :model="form">
                <el-form-item label="Username: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Họ tên: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_hoten" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Giới tính: " :label-width="formLabelWidth">
                    <el-select v-model="form.nd_gioitinh" placeholder="Chọn giới tính">
                        <el-option label="Nam" :value="2" />
                        <el-option label="Nữ" :value="1" />
                        <el-option label="Không rõ" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Email: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Số điện thoại: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_sdt" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Mật khẩu: " :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.nd_matkhau" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Địa chỉ: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_diachi" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Ngày sinh: " :label-width="formLabelWidth">
                    <el-date-picker v-model="form.nd_ngaysinh" type="date" placeholder="Chọn ngày sinh" />
                </el-form-item>
                <el-form-item label="Hình: " :label-width="formLabelWidth">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <template #file="{ file }">
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleDownload(file)">
                                        <el-icon>
                                            <Download />
                                        </el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleRemove(file)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </span>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="Vai trò: " :label-width="formLabelWidth">
                    <el-select v-model="form.vt_ma" placeholder="Chọn vai trò">
                        <el-option v-for="role in roleData" :key="role.vt_ma" :label="role.vt_ten"
                            :value="role.vt_ma" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="handleAdd">Confirm</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- Form Sửa -->
        <el-dialog align-center v-model="dialogFormEdit" title="Cập nhật người dùng" width="500">
            <el-form :model="form">
                <el-form-item label="Username: " :label-width="formLabelWidth">
                    <el-input disabled v-model="form.nd_username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Họ tên: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_hoten" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Giới tính: " :label-width="formLabelWidth">
                    <el-select v-model="form.nd_gioitinh" placeholder="Chọn giới tính">
                        <el-option label="Nam" :value="2" />
                        <el-option label="Nữ" :value="1" />
                        <el-option label="Không rõ" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Email: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Số điện thoại: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_sdt" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Địa chỉ: " :label-width="formLabelWidth">
                    <el-input v-model="form.nd_diachi" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Ngày sinh: " :label-width="formLabelWidth">
                    <el-date-picker v-model="form.nd_ngaysinh" type="date" placeholder="Chọn ngày sinh" />
                </el-form-item>
                <el-form-item label="Hình: " :label-width="formLabelWidth">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <template #file="{ file }">
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleDownload(file)">
                                        <el-icon>
                                            <Download />
                                        </el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleRemove(file)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </span>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="Vai trò: " :label-width="formLabelWidth">
                    <el-select v-model="form.vt_ma" placeholder="Chọn vai trò">
                        <el-option v-for="role in roleData" :key="role.vt_ma" :label="role.vt_ten"
                            :value="role.vt_ma" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormEdit = false">Cancel</el-button>
                    <el-button type="primary" @click="handleConfirm(form)">Confirm</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { deleteNguoiDung, getListNguoiDung } from '@/api/nguoidung';
import { getListVaiTro } from '@/api/vaitro';
import { getListMonHoc, addMonHoc, updateMonHoc, deleteMonHoc } from '@/api/monhoc';
import { ElMessage } from 'element-plus'
import { Plus, UserFilled } from '@element-plus/icons-vue'
const search = ref('');
const tableData = ref([]);
const khoiLopData = ref([]);
const editingRow = ref(null);
const editName = ref('');
const editKhoiLop = ref('');

const dialogFormVisible = ref(false);
const dialogFormEdit = ref(false);


const form = ref({
    name: '',
    kl_ma: null,
});

const filterTableData = computed(() =>
    tableData.value.filter(
        data =>
            !search.value ||
            data.kl_ten.toLowerCase().includes(search.value.toLowerCase()) ||
            data.mh_ten.toLowerCase().includes(search.value.toLowerCase())
    )
);

const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const data = await getListNguoiDung();
        tableData.value = data;
        const vtdata = await getListVaiTro();
        vaiTroData.value = vtdata;
        console.log(vaiTroData.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
        loading.value = false;
    }
});
const openEditDialog = (row) => {
    form.value = { ...row };
    dialogFormEdit.value = true;
};
function getTagType(role) {
    switch (role) {
        case 'Admin':
            return 'warning';
        case 'Giáo Viên':
            return 'primary';
        case 'Học Sinh':
            return 'info';
        case 'Super Admin':
            return 'danger';
        default:
            return 'success'; // Default type if none of the above matches
    }
}
function  formatGender(row, column, cellValue) {
      switch (cellValue) {
        case 2:
          return 'Nam';
        case 1:
          return 'Nữ';
        case 0:
          return 'Không rõ';
        default:
          return 'Không xác định'; // Giá trị mặc định nếu không phù hợp với các trường hợp trên
      }
    }
const handleAdd = async () => {
    if (form.value.name.trim() !== '' && form.value.kl_ma) {
        try {
            const response = await addMonHoc({ mh_ten: form.value.name, kl_ma: form.value.kl_ma });
            console.log('Dữ liệu trả về:', response.data);

            if (response.success) {
                // Tạo đối tượng mới với các trường cần thiết
                const newEntry = {
                    mh_ma: response.data.mh_ma, // ID môn học
                    mh_ten: response.data.mh_ten, // Tên môn học
                    kl_ten: khoiLopData.value.find(khoiLop => khoiLop.kl_ma === form.value.kl_ma)?.kl_ten // Tên khối lớp
                };
                tableData.value.unshift(newEntry); // Thêm vào bảng dữ liệu
                dialogFormVisible.value = false;
                ElMessage({
                    message: 'Thêm thành công!',
                    type: 'success',
                });
            } else {
                console.error('Lỗi khi thêm:', response.message);
                ElMessage.error('Có lỗi xảy ra.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm:', error);
            ElMessage.error('Có lỗi xảy ra!');
        }
    } else {
        ElMessage.error('Tên môn học và khối lớp không được để trống!');
    }
};




const handleConfirm = async row => {
    if (editingRow.value !== null) {
        try {
            const updatedRow = { ...row, mh_ten: editName.value, kl_ma: editKhoiLop.value };
            console.log('Cập nhật:', updatedRow);

            const response = await updateMonHoc(updatedRow);
            console.log('Kết quả phản hồi:', response);

            if (response.success) {
                tableData.value = tableData.value.map((item, index) =>
                    index === editingRow.value ? updatedRow : item
                );
                console.log(tableData.value);

                editingRow.value = null;
                editName.value = '';
                ElMessage({
                    message: 'Cập nhật thành công',
                    type: 'success',
                });
            } else {
                console.error('Lỗi khi cập nhật:', response.message);
                ElMessage.error('Có lỗi xảy ra.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            ElMessage.error('Có lỗi xảy ra!');
        }
    }
};

const handleDelete = async (index, row) => {
    try {
        await ElMessageBox.confirm(
            'Người dùng sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?',
            'Cảnh báo',
            {
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                type: 'warning',
            }
        );

        // Nếu người dùng xác nhận, thực hiện xóa
        const response = await deleteNguoiDung(row.nd_username);
        console.log(row.nd_username);

        console.log(response);

        if (response.success) {
            tableData.value = tableData.value.filter((item, i) => i !== index);
            ElMessage({
                message: 'Xóa thành công!',
                type: 'success',
            });
        } else {
            console.error('Lỗi khi xóa:', response.message);
            ElMessage.error('Không thể xóa người dùng này!');
        }
    } catch (error) {
        // Nếu người dùng hủy bỏ hành động xóa, hiển thị thông báo hủy
        if (error === 'cancel') {
            ElMessage({
                type: 'info',
                message: 'Xóa đã bị hủy!',
            });
        } else {
            console.error('Lỗi khi xóa:', error);
            ElMessage.error('Có lỗi xảy ra!');
        }
    }
};

</script>
