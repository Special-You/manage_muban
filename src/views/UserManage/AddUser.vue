<template>
    <div>
        <Banner></Banner>
        <!--模糊查询条件-->
        <Form :model="query_user" :label-width="80">
            <Row>
                <Col :md="6" :lg="6">
                    <FormItem label="姓名">
                        <Input v-model="query_user.name" clearable placeholder="请输入姓名" type="text" @on-change=query_all_user(1)></Input>
                    </FormItem>
                </Col>
                <Col :md="6" :lg="6">
                    <FormItem label="电话">
                        <Input v-model="query_user.phone" clearable placeholder="请输入电话" type="text" @on-change=query_all_user(1) ></Input>
                    </FormItem>
                </Col>
                <Col :md="6" :lg="6">
                    <FormItem label="角色名称">
                        <Select v-model="query_user.roleId" clearable placeholder="请选择角色名称"
                                @on-change=dailyQuery(1)>
                            <Option :value="role.id" v-for="(role,index) in role_arr" :key="index" @on-change=query_all_user(1)>{{role.name}}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <!--查询结果-->
        <Table :columns="user_col" :data="user_data" :loading='loading'></Table>
        <div style="text-align: right;margin-top:20px;">
            <Page :total="total" :current="current" prev-text="上一页" :page-size="10" next-text="下一页"
                  @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    import Banner from '../../components/Barner'
    export default {
        name: "AddUser",
        components:{
            Banner
        },
        data(){
            return{
                query_user:{
                    name:'',
                    phone:'',
                    roleId:'',
                },
                role_arr:[],
                user_col:[
                    {

                    }
                ],
                user_data:[],
                loading:true,
                total:1,
                current:1,
            }
        },
        created(){
            this.get_all_role();
            this.query_all_user(1);
        },
        methods:{
            get_all_role(){
                $api.http.post($api.role_list,{})
                    .then(data=>{
                        if($api.validata(data,this)){
                            this.role_arr = data.data;
                            this.total = data.data.total;
                        }
                    })
                    .catch(error=>{
                        this.$Message.error('数据请求失败');
                    })
            },
            query_all_user(curr){
                let obj = {};
                obj.size = 10;
                obj.current = curr;
                obj.params = this.query_user;
                $api.http.post($api.user_queryPages,obj)
                    .then(data=>{
                        if($api.validata(data,this)){

                        }
                    })
                    .catch(error=>{
                        this.$Message.error('数据请求失败')
                    })
            },
            changePage(curr) {
                this.loading = true;
                this.query_all_user(curr);
                this.current = curr;
            }
        }
    }
</script>

<style scoped>

</style>
