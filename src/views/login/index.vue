<template>
  <div class="login-container">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      class="login-form"
    >
      <h2 class="login-title">山东富通智能工厂综合管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 0, max: 20, message: "请输入3-20个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 0, message: "密码至少为8位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.form.username, this.form.password).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              //验证成功，通过token获取用户信息
              getUserInfo(resp.data.token).then(response => {
                //获取到了用户的信息
                const respUser = response.data;
                if (respUser.flag) {
                  console.log("userinfo" + respUser.data);
                  // 1.保存token和用户信息
                  localStorage.setItem(
                    "mxg-mms-user",
                    JSON.stringify(respUser.data)
                  );
                  localStorage.setItem("mxg-mms-token", resp.data.token);
                  // 2.前往首页
                  this.$router.push("/");
                } else {
                  this.$message({
                    message: respUser.message,
                    type: "warning"
                  });
                }
              });
            } else {
              // 验证未通过,弹出警告
              // alert(resp.message)
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 25px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg");
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>