<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 顶栏 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable >
              <el-button slot="append" class="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区 -->
        <el-table :data="userList" border stripe >
          <el-table-column type="index" ></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email" ></el-table-column>
          <el-table-column label="电话" prop="mobile" ></el-table-column>
          <el-table-column label="角色" prop="role_name" ></el-table-column>
          <!-- 状态 -->
          <el-table-column label="状态" >
            <template slot-scope="scope">
              <!-- scope.row是当前行的数据 -->
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" ></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
              <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
                 <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

         <!-- 分页 -->
        <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

      <!-- ref当前表单的引用 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px"  >
        <el-form-item label="用户名" prop="username"  >
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addForm.password"  ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email"  >
          <el-input v-model="addForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" >
          <el-input v-model="addForm.mobile"  ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false" >取 消</el-button>
        <el-button type="primary"  @click="addUser" >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- ref当前表单的引用 -->
      <el-form  label-width="70px" :model="editForm" :rules="editFormRules" ref="editFormRef" >
        <el-form-item label="用户名"  >
          <el-input v-model="editForm.username" disabled ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false" >取 消</el-button>
        <el-button type="primary" @click="editUser" >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色弹出框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogclosed">
      
      <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible=false" >取 消</el-button>
        <el-button type="primary"  @click="saveRoleInfo" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    
    // 定义验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if(regEmail.test(value)){
        // 验证成功
        return callback()
      }
      // 验证失败
      callback(new Error('请输入合法邮箱'))
    }
    // 定义验证手机号规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if(regMobile.test(value)){
        // 验证成功
        return callback()
      }
      // 验证失败
      callback(new Error('请输入合法手机号'))
    }

    return {
      // 查询用户信息时的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 存储用户信息
      userList: [],
      total: 0,
      // 是否显示添加用户弹出框
      addDialogVisible: false,
      // 添加用户表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, message: '邮箱格式不正确请重新输入', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, message: '手机格式不正确请重新输入', trigger: 'blur' }
          ]

      },
      // 设置修改用户的弹出框是否可见
      editDialogVisible: false, 
       // 修改用户表单的数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, message: '邮箱格式不正确请重新输入', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, message: '手机格式不正确请重新输入', trigger: 'blur' }
          ]

      },
      // 分配角色弹出框的显示与隐藏
      setRoleDialogVisible: false,
      // 保存正在操作的用户的信息
      userInfo: {},
      // 所有的角色信息
      rolesList: [],
      // 保存用户选中的角色的id
      selectedRoleId: ''

    }
  },

  methods: {
      // 获取用户信息
      async getUserList(){
        const { data: res } = await this.$http.get('users', {params: this.queryInfo});
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error('获取用户列表失败');
        this.userList = res.data.users;
        this.total = res.data.total;
        // console.log(this.userList)
      },
      // 每页显示的数据大小变化时
      handleSizeChange(newSize){
        // console.log(newSize)
        this.queryInfo.pagesize = newSize;
        this.getUserList();

      },
      // 当前页变化时
      handleCurrentChange(newPage){
        // console.log(newPage)
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      // 改变用户状态
      async userStateChanged(row){
        console.log(row)
        const {data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`);
        console.log(res)
        // 设置失败
        if(res.meta.status !== 200) {
          // 回复设置前的状态
          res.mg_state = !res.mg_state;
          return this.$message.error('状态设置失败');
        }
        // 设置成功
        this.$message.success('状态设置成功')
      },
      // 关闭弹框将重置表单
      addDialogClosed(){
          // 关闭表单将重置
          this.$refs.addFormRef.resetFields();
      },
      // 提交添加用户表单
      addUser(){
        // 表单预验证，所有表单都符合要求才发情请求
        this.$refs.addFormRef.validate(async valid => {
            // 均符合要求时 valid 是true
            // console.log(valid)  

            // 不符合要求时
            if(!valid) return this.$message.error('请填写完整用户信息');
            
            // 符合要求时
            const { data: res } =  await this.$http.post('users', this.addForm);
            console.log(res)

            // 创建用户失败
            if(res.meta.status !== 201) return this.$message.error('添加用户失败')

            // 添加用户成功
            this.addDialogVisible = false;
            this.$message.success('数据添加成功')
            this.getUserList();

        })
      },
      // 显示编辑用户表单
      async showEditDialog(id){
        // console.log(obj)
        // return;
        // console.log(id)
        // 根据id查询用户
        const { data: res } = await this.$http.get('users/'+id);
        // console.log(res)

        // 用户信息获取失败
        if(res.meta.status !== 200) return this.$message.error('用户信息获取失败')

        // 用户信息获取成功
        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      // 关闭编辑用户对话框重置表单
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },
      // 提交修改用户表单
      editUser(){
        this.$refs.editFormRef.validate(async valid=>{
          // valid 为true 预验证成功
          // console.log(valid)
          // console.log(this.editForm)
          // 预验证失败
          if(!valid) return this.$message.error('请输入正确格式的信息')

          // 预验证成功 发送请求
          const {data: res} = await this.$http.put('users/'+ this.editForm.id,  {
             email: this.editForm.email,
             mobile: this.editForm.mobile
             } )
          // console.log(res)
          // {
            // email: this.editForm.email,
            // mobile: this.editForm.mobile
            // }
          // 数据跟新失败
          if(res.meta.status !== 200) return this.$message.error('数据更新失败')

          // 数据更新成功
          this.$message.success('数据更新成功');
          this.getUserList();
          this.editDialogVisible=false
        })
        
      },
      // 删除用户
      async removeUserById(id){
          // console.log(id)
          // 弹框询问
          const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err);
          // catch(err=>err) 捕获错误 这样点击取消时返回cancel

          // 确定  confirmResult = confirm
          // 取消  confirmResult = cancel
          // console.log(confirmResult)

          // 点击取消
          if(confirmResult == 'cancel') return this.$message.info('已经取消删除')

          //点击确定
          const {data: res} = await this.$http.delete('users/'+ id)
          // console.log(res)
          // 用户删除失败
          if(res.meta.status !== 200) return this.$message.error('删除用户失败')
          // 用户删除成功
          this.$message.success('删除用户成功')
          this.getUserList();

      },
      // 分配角色
      async setRole(item){
        this.setRoleDialogVisible = true;
        // console.log(item)
        this.userInfo = item;

        // 获取所有的角色信息
        const {data: res} = await this.$http.get('roles')
        // console.log(res)

        // 获取失败
        if(res.meta.status != 200) return this.$message.error('获取角色列表失败')

        // 获取成功
        this.rolesList = res.data;
      },
      // 保存用户角色信息
      async saveRoleInfo(){
        // 判断是是否分配了角色
        if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色')

        // 若分配了就发送请求
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId })
        console.log(res)

        //设置失败
        if(res.meta.status != 200) return this.$message.error('角色设置失败')

        // 设置成功
        this.$message.success('角色设置成功');
        this.getUserList();
        this.setRoleDialogVisible = false
      },
      // 关闭设置角色的对话框时
      setRoleDialogclosed(){
          this.userInfo= {},
          this.selectedRoleId = ''
      }

  },

  created () {
    // 查询用户信息
    this.getUserList();
  }
}
</script>

<style lang='less' scoped>
  
</style>
