<template>
    <div class="bg">
        <div class="title">后台管理系统</div>
        <!--<div><img class="suo" src="../assets/imgs/suo.png" alt=""></div>-->
        <!--<div><img class="pian" src="../assets/imgs/pian.png" alt=""></div>-->
        <div class="login">
            <div style="width: 300px;">
                <div>
                    <Form :model="loginInfo" ref="loginInfo" :rules="ruleForm" :loading='loading'>
                        <FormItem prop="phone">
                            <Input prefix="ios-call" v-model="loginInfo.phone" placeholder="请输入账号" size="large"
                                   type="text" class="account">
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input prefix="md-lock" v-model="loginInfo.password" placeholder="请输入密码" size="large"
                                   type="password" class="password" @on-enter="submitForm('loginInfo')">

                            </Input>
                        </FormItem>
                        <FormItem style="margin-top: 20px; text-align: center">
                            <Button type="primary" @click="submitForm('loginInfo')" style="margin-right: 20px;">登录
                            </Button>
                            <Button @click="resetForm('loginInfo')">重置</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loading: true,
                loginInfo: {
                    phone: '',
                    password: '',
                },
                ruleForm: {
                    phone: [{required: true, message: '账号必填', trigger: 'blur'}],
                    password: [{required: true, message: '密码必填', trigger: 'blur'}]
                }
            }
        },
        methods: {
            submitForm(name) {
                let self = this;
                this.$refs[name].validate(valid => {
                    if (valid) {
                        let params = self.loginInfo;
                        $api.http.post($api.login, params)
                            .then(data => {
                                if($api.validata(data,self)){
                                    self.loading = false;
                                    self.$Message.success('登录成功！');
                                    setTimeout(function () {
                                        self.$router.push('/');
                                    }, 1500);
                                    localStorage.setItem('_token', data.data.token);
                                    localStorage.setItem('name', data.data.data.name);
                                    localStorage.setItem('id', data.data.data.id);
                                }
                            })
                            .catch(error => {
                                self.$Message.error('网络请求失败');
                            })
                    } else {
                        self.$Message.error('请输入账号或密码！')
                    }
                })
            },
            resetForm(name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>
    .bg {
        background-image: url("../assets/imgs/login.png");
        height: 100%;
        background-size: cover;
    }

    .title {
        color: #ebfffe;
        font-size: 40px;
        font-weight: bold;
        letter-spacing: 8px;
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .suo{
        position: absolute;
        top: 50%;
        right: 7%;
        display: block;
        width: 500px;
    }
    .pian{
        position: absolute;
        top:0;
        left: 0;
    }

    .login {
        /*width: 600px;*/
        /*height: 300px;*/
        border-radius: 10px;
        background-color: rgba(255,255,255,0.3);
        padding: 40px 60px;
        /*background-image: url("../assets/imgs/zhong.png");*/
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .account {
        margin-top: 20px;
    }

    .password {
        /*margin-top: 20px;*/
        /*width: 300px;*/
    }
</style>
