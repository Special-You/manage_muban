<template>
<div>
    <Banner></Banner>
    <Row>
        <Col :sm="12" :md="12" :lg="12">
            <Form :model="add_meau" ref="add_meau" :rules="add_meau_rules" :label-width="120">
                <FormItem label="父菜单id" prop="pid">
                    <Input v-model="add_meau.pid" clearable type="text" ></Input>
                </FormItem>
                <FormItem label="菜单id" prop="id">
                    <Input v-model="add_meau.id" clearable type="text"></Input>
                </FormItem>
                <FormItem label="菜单名称" prop="name">
                    <Input v-model="add_meau.name" clearable type="text"></Input>
                </FormItem>
                <FormItem label="子菜单对应的页面" prop="url">
                    <Input v-model="add_meau.url" clearable type="text"></Input>
                </FormItem>
                <FormItem label="是否为子菜单(1是)" prop="leaf">
                    <Input v-model="add_meau.leaf" clearable type="text"></Input>
                    <!--<Select v-model="add_meau.leaf" clearable placeholder="请选择是否为子菜单">-->
                        <!--<Option value="1">是</Option>-->
                        <!--<Option value="2">否</Option>-->
                    <!--</Select>-->
                </FormItem>
                <FormItem style="margin-top: 20px; text-align: center; margin-left: -120px">
                    <Button type="primary" @click="submit_add_meau('add_meau')" style="margin-right: 20px;">提交</Button>
                    <Button @click="reset_add_meau('add_meau')">重置</Button>
                </FormItem>
            </Form>
        </Col>
    </Row>
</div>
</template>

<script>
    import Banner from '../../components/Barner'
    export default {
        name: "AddList",
        components:{
            Banner
        },
        data(){
            return{
                add_meau:{
                    id:'',
                    name:'',
                    pid:'',
                    url:'',
                    leaf:'',
                },
                add_meau_rules:{
                    name:[{required: true, message: '必填', trigger:'blur'}],
                    id:[{required: true, message: '必填', trigger:'blur'}],
                }
            }
        },
        methods:{
            submit_add_meau(name){
                this.$refs[name].validate(valid => {
                    if(valid){
                        let params = this.add_meau;
                        $api.http.post($api.menus_add,params)
                            .then(data=>{
                                if($api.validata(data,this)){
                                    this.$Message.success('添加成功!');
                                    this.add_meau={
                                        id:'',
                                        name:'',
                                        pid:'',
                                        url:'',
                                        leaf:'',
                                    };
                                }
                            })
                            .catch(error => {
                                this.$Message.error('数据请求失败');
                            })
                    }else {
                        this.$Message.error('请输入必填项！')
                    }
                })
            },
            reset_add_meau(name){
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
