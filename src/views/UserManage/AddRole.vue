<template>
    <div>
        <Banner></Banner>
        <Row :style="{marginTop:'-10px', marginBottom:'20px'}">
            <Col :sm="22" :md="22" :lg="22">
                .
            </Col>
            <Col :sm="2" :md="2" :lg="2">
                <Button type="dashed" shape="circle" @click="role_modle_open">添加</Button>
            </Col>
        </Row>
        <!--添加弹窗-->
        <Modal v-model="add_role_modle" fullscreen @on-ok="submit_role" @on-cancel="add_role_modle = false">
            <p slot="header" style="color:#f60;text-align:center">
                <span>添加角色</span>
            </p>
            <div>
                <Form :model="add_roles" :label-width="100">
                    <Row>
                        <Col :md="12" :lg="12">
                            <FormItem label="角色名称">
                                <Input type="text" clearable v-model="add_roles.name" placeholder="请输入角色名称"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <!--<Col :md="12" :lg="12">-->
                        <!--<FormItem label="描述">-->
                        <!--<Input type="textarea" clearable v-model="add_roles.description"-->
                        <!--placeholder="请输入描述"></Input>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                    <Divider orientation="left">角色权限</Divider>
                    <div style="padding-bottom:10px;margin-bottom:10px;"
                         v-for="(meau01,index) in meau_lists" :key="index">
                        <div style="display: block; border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:10px;margin-left: 30px">
                            {{meau01.name}}
                        </div>
                        <Checkbox v-for="(meau02, index) in meau01.menus" :key="index" :label=meau02.id
                                  v-model="meau02.checked" style="margin-left: 50px">
                            {{meau02.name}}
                        </Checkbox>
                    </div>
                </Form>
            </div>
        </Modal>
        <!--查询结果-->
        <Table :columns="role_col" border stripe :data="role_data" :loading='loading'></Table>
        <div style="text-align: right;margin-top:20px;">
            <Page :total="total_role" :current="current_role" prev-text="上一页" :page-size="10" next-text="下一页"
                  @on-change="change_role_page"></Page>
        </div>
        <!--编辑弹窗-->
        <Modal v-model="update_role_modle" fullscreen @on-ok="update_role" @on-cancel="update_role_modle = false">
            <p slot="header" style="color:#f60;text-align:center">
                <span>修改角色</span>
            </p>
            <div>
                <Form :model="update_roles" :label-width="100">
                    <Row>
                        <Col :md="12" :lg="12">
                            <FormItem label="角色名称">
                                <Input type="text" clearable v-model="update_roles.name" placeholder="请输入角色名称"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <!--<Col :md="12" :lg="12">-->
                        <!--<FormItem label="描述">-->
                        <!--<Input type="textarea" clearable v-model="add_roles.description"-->
                        <!--placeholder="请输入描述"></Input>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                    <Divider orientation="left">角色权限</Divider>
                    <div style="padding-bottom:10px;margin-bottom:10px;"
                         v-for="(meau01,index) in meau_lists" :key="index">
                        <div style="display: block; border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:10px;margin-left: 30px">
                            {{meau01.name}}
                        </div>
                        <Checkbox v-for="(meau02, index) in meau01.menus" :key="index" :label=meau02.id
                                  v-model="meau02.checked" style="margin-left: 50px">
                            {{meau02.name}}
                        </Checkbox>
                    </div>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Banner from '../../components/Barner'

    export default {
        name: "AddRole",
        components: {
            Banner
        },
        data() {
            return {
                add_role_modle: false,
                meau_lists: [],
                add_roles: {
                    name: '',
                    // description: '',
                },
                role_col: [
                    {
                        type: 'index',
                        title: '序号',
                        align: 'center',
                        minWidth: 100,
                        maxWidth: 100,
                    },
                    {
                        title: '角色名字',
                        key: 'name',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        minWidth: 150,
                        maxWidth: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        marginRight: '5px',
                                        //display: (params.row.status === '未审核' || params.row.status === '通过') ? 'inline-block' : 'none'
                                    },
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.id = params.row.id;
                                            this.update_role_modle = true;
                                            this.update_roles.name = params.row.name;
                                            // this.updateRoles.description = params.row.description;
                                            let menusid = [];
                                            $api.http.post($api.menu_getByRoleId, {
                                                roleId: params.row.id
                                            })
                                                .then(data => {
                                                    if ($api.validata(data, this)) {

                                                        for (let i = 0; i <data.data.length ; i++) {
                                                            for (let j = 0; j <data.data[i].menus.length ; j++) {
                                                                menusid.push(data.data[i].menus[j].id)
                                                            }
                                                        }
                                                        console.log(menusid,1212)
                                                        for (let i = 0; i <this.meau_lists.length ; i++) {
                                                            for (let j = 0; j <this.meau_lists[i].menus.length ; j++) {
                                                                if(menusid[i]===this.meau_lists[i].menus[j].id){
                                                                    this.meau_lists[i].menus[j].checked = true;
                                                                }

                                                            }

                                                        }
                                                    }
                                                })
                                                .catch(error => {
                                                    this.$Message.error('网络请求失败！');
                                                })
                                            $api.http.post($api.menus_list, {})
                                                .then(data => {
                                                    if ($api.validata(data, this)) {
                                                        var meau_lists = data.data;
                                                        this.meau_lists = meau_lists;
                                                        for (let i = 0; i < meau_lists.length; i++) {
                                                            var menu1 = meau_lists[i];
                                                            menu1.checked = false;
                                                            var menus = menu1.menus;
                                                            for (let j = 0; j < menus.length; j++) {
                                                                var menu2 = menus[j];

                                                            }
                                                        }
                                                    }
                                                })
                                                .catch(error => {
                                                    this.$Message.error('数据请求失败')
                                                })
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        placement: 'top',
                                        confirm: true,
                                        title: '确定删除吗？',
                                        transfer: true
                                    },
                                    style: {
                                        //display: (params.row.status === '未审核') ? 'inline-block' : 'none'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            $api.http.post($api.role_delete, {
                                                id: params.row.id
                                            })
                                                .then(data => {
                                                    if ($api.validata(data, this)) {
                                                        this.$Message.success('删除成功！');
                                                        this.get_all_roles(this.current_role);
                                                    }
                                                })
                                                .catch(error => {
                                                    this.$Message.error('网络请求失败');
                                                })
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        }
                                    }, '删除')
                                ])
                            ])
                        }
                    },
                ],
                role_data: [],
                loading: true,
                total_role: 1,
                current_role: 1,
                update_role_modle: false,
                update_roles: {
                    name: '',
                },
                id: ''
            }
        },
        created() {
            this.get_all_roles(1);
        },
        methods: {
            role_modle_open() {
                this.add_role_modle = true;
                this.get_all_lists();
            },
            //查询所有菜单
            get_all_lists() {
                $api.http.post($api.menus_list, {})
                    .then(data => {
                        if ($api.validata(data, this)) {
                            var meau_lists = data.data;
                            this.meau_lists = meau_lists;
                            for (let i = 0; i < meau_lists.length; i++) {
                                var menu1 = meau_lists[i];
                                menu1.checked = false;
                                var menus = menu1.menus;
                                for (let j = 0; j < menus.length; j++) {
                                    var menu2 = menus[j];
                                    menu2.checked = false;
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.$Message.error('数据请求失败')
                    })
            },
            get_select_menuid_all: function () {
                var get_select_menuid_arr = [];
                var meau_lists = this.meau_lists;
                for (let i = 0; i < meau_lists.length; i++) {
                    var menu1 = meau_lists[i];
                    var menus = menu1.menus;
                    for (let j = 0; j < menus.length; j++) {
                        var menu2 = menus[j];
                        if (menu2.checked) {
                            get_select_menuid_arr.push(
                                {
                                    menuId: menu2.id
                                });
                            if (!this.is_contain(get_select_menuid_arr, menu2.pid)) {
                                get_select_menuid_arr.push(
                                    {
                                        menuId: menu2.pid
                                    }
                                );
                            }
                        }
                    }
                }
                return get_select_menuid_arr;
            },
            //去重
            is_contain: function (arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].menuId === id) {
                        return true;
                    }
                }
                return false;
            },

            //提交添加角色
            submit_role() {
                let obj = this.add_roles;
                obj.details = this.get_select_menuid_all();
                $api.http.post($api.role_add, obj)
                    .then(data => {
                        if ($api.validata(data, this)) {
                            this.get_all_roles(1);
                        }
                    })
                    .catch(error => {
                        this.$Message.error('数据请求失败')
                    })
            },
            //查询所有角色
            get_all_roles(curr) {
                let obj = {};
                obj.current = curr;
                obj.size = 10;
                $api.http.post($api.role_queryPages, obj)
                    .then(data => {
                        if ($api.validata(data, this)) {
                            this.total_role = data.data.total;
                            this.role_data = data.data.records;
                            this.loading = false;
                        }
                    })
                    .catch(error => {
                        this.$Message.error('数据请求失败')
                    })
            },
            change_role_page(curr) {
                this.current_role = curr;
                this.get_all_roles(curr);
                this.loading = true;
            },
            //更新角色
            update_role() {

            }
        }
    }
</script>

<style scoped>
    /deep/ .ivu-form-item-label {
        font-size: 14px;
    }
</style>
