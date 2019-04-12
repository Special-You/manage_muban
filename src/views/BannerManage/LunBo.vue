<template>
    <div>
        <Banner></Banner>
        <!--<Add @click="lunbo_open"></Add>-->
        <Row :style="{marginTop:'-20px', marginBottom:'10px'}">
            <Col :sm="22" :md="22" :lg="22">
                .
            </Col>
            <Col :sm="2" :md="2" :lg="2">
                <Button type="dashed" shape="circle" @click="add_lunbo_model = true">添加</Button>
            </Col>
        </Row>
        <!--查询结果-->
        <Table :columns="lunbo_col" :data="lunbo_data" :loading='loading'></Table>
        <div style="text-align: right;margin-top:20px;">
            <Page :total="total_lunbo" :current="current_lunbo" prev-text="上一页" :page-size="10" next-text="下一页"
                  @on-change="change_lunbo_page"></Page>
        </div>
        <!--添加弹窗-->
        <Modal v-model="add_lunbo_model" fullscreen footer-hide  @on-ok="commit_add_lunbo" @on-cancel="add_lunbo_model = false">
            <p slot="header" style="color:#f60;text-align:center">
                <span>添加轮播图</span>
            </p>
            <div>
                <Row>
                    <Col :md="12" :lg="12">
                        <Form :model="lunbo_form" ref="lunbo_form" :rules="lunbo_rule" :label-width="80">
                            <FormItem label="名称" prop="name">
                                <Input type="text" clearable v-model="lunbo_form.name" placeholder="名称"></Input>
                            </FormItem>
                            <FormItem label="跳转地址" prop="targetUrl">
                                <!--<InputNumber :min="1" v-model="baoXiao.claimMoney"></InputNumber>-->
                                <Input type="text" clearable v-model="lunbo_form.targetUrl" placeholder="跳转地址"></Input>
                            </FormItem>
                            <FormItem label="类型" prop="type">
                                <Input type="text" clearable v-model="lunbo_form.type" placeholder="类型"></Input>
                            </FormItem>
                            <FormItem label="上传图片">
                                <div class="demo-upload-list" v-for="item in uploadList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="demo-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                        ref="upload"
                                        :show-upload-list="false"
                                        :default-file-list="defaultList"
                                        :on-success="handleSuccess"
                                        :format="['jpg','jpeg','png']"
                                        :max-size="2048"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload"
                                        multiple
                                        type="drag"
                                        :headers="{'token':d_token}"
                                        action='http://47.105.150.4:8081/file/upload'
                                        style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="ios-camera" size="20"></Icon>
                                    </div>
                                </Upload>
                                <Modal title="查看大图" v-model="visible">
                                    <img :src=showPicUrl v-if="visible" style="width: 100%">
                                </Modal>
                            </FormItem>
                            <FormItem style="margin-top: 20px; text-align: center">
                                <!--<Button type="primary" @click="submitForm('baoXiao')"-->
                                <!--style="margin-left: -80px;padding: 10px 150px">提交-->
                                <!--</Button>-->
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Modal>


    </div>
</template>

<script>
    import Banner from '../../components/Barner'
    import Add from '../../components/Add'

    export default {
        name: "LunBo",
        components: {
            Banner,
            Add,
        },
        data() {
            return {
                lunbo_col: [
                    {
                        type: 'index',
                        title: '序号',
                        align: 'center',
                        minWidth: 100,
                        maxWidth: 100,
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '图片',
                        key: 'picturePath',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let self = this;
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.picturePath
                                    },
                                    style: {
                                        display: 'inline-block',
                                        width: '100px',
                                        height: '60px'
                                    },
                                    // on:{
                                    //     click(){
                                    //         self.previewPicUrl = params.row.picture;
                                    //         self.visible = true;
                                    //     }
                                    // }
                                })
                            ])
                        }
                    },
                    {
                        title: '跳转地址',
                        key: 'targetUrl',
                        align: 'center',
                        minWidth: 100,
                    },
                    {
                        title: '类型',
                        key: 'type',
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
                                            // this.id = params.row.id;
                                            // this.updateRoleModle = true;
                                            // this.queryAcess();
                                            // this.updateRoles.name = params.row.name;
                                            // this.updateRoles.description = params.row.description;
                                            // $api.http.post($api.update_get_access_byRoleId, {
                                            //     id: params.row.id
                                            // })
                                            //     .then(data => {
                                            //         if (data.flag === 1) {
                                            //             let all_list = [];
                                            //             let list = [];
                                            //             // console.log(this.flat_menu,55555)
                                            //             for(let i = 0; i<data.data.length; i++){
                                            //                 for(let j = 0; j<data.data[i].accesses.length; j++){
                                            //                     list = data.data[i].accesses[j].id;
                                            //                     all_list.push(list);
                                            //                 }
                                            //             }
                                            //             for(let j = 0; j<all_list.length; j++){
                                            //                 for(let i =0; i<this.flat_menu.length; i++){
                                            //                     // console.log(this.flat_menu[i].id,1111)
                                            //                     if(all_list[j] === this.flat_menu[i].id ){
                                            //
                                            //                         // this.flat_menu[i].checked = true;
                                            //                         this.flat_menu[i].checked = true;
                                            //                         // console.log(this.flat_menu[i],14111)
                                            //                     }
                                            //                 }
                                            //             }
                                            //
                                            //         } else {
                                            //             if (data.message === 'token is invalid') {
                                            //                 this.$router.push('Login')
                                            //             } else {
                                            //                 this.$Message.warning(data.message);
                                            //             }
                                            //         }
                                            //     })
                                            //     .catch(error => {
                                            //         this.$Message.error('网络请求失败！');
                                            //     })
                                        }
                                    }
                                }, '编辑'),
                                // h('Button', {
                                //     style: {
                                //         marginRight: '5px',
                                //         //display: (params.row.status === '未审核' || params.row.status === '不通过') ? 'inline-block' : 'none'
                                //     },
                                //     props: {
                                //         type: 'error',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //
                                //         }
                                //     }
                                // }, '不通过'),
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
                                                        this.get_lunbo_all(this.current_lunbo);
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
                lunbo_data: [],
                loading: true,
                total_lunbo: 1,
                current_lunbo: 1,
                add_lunbo_model:false,
                lunbo_form:{
                    name:'',
                    picturePath:'',
                    targetUrl:'',
                    type:''
                },
                lunbo_rule:{

                },
                defaultList:[],
                uploadList:[],
                d_token: localStorage.getItem('_token'),
                visible:false,
                showPicUrl:'',
                imgName:'',
            }
        },
        created() {
            this.get_lunbo_all(1);
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            //分页查询轮播
            get_lunbo_all(curr) {
                let obj = {};
                obj.size = 10;
                obj.current = curr;
                obj.params = {};
                $api.http.post($api.banner_page, obj)
                    .then(data => {
                        if ($api.validata(data, this)) {
                            this.lunbo_data = data.data.records;
                            this.total_lunbo = data.data.total;
                            this.loading = false;
                        }
                    })
                    .catch(error => {
                        this.$Message.error('数据请求失败');
                    })
            },
            change_lunbo_page(curr) {
                this.current_lunbo = curr;
                this.get_lunbo_all(curr);
                this.loading = true;
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                console.log(res,file,444);
                this.showPicUrl = res.data.data;
                this.lunbo_form.picturePath = res.data.data;
                file.url = res.data.data;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '名为 ' + file.name + ' 的图片格式错误 , 请选择 jpg 或 png格式的图片.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小超出限制',
                    desc: '名为  ' + file.name + ' 的图片文件太大了, 不能超过 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '只能上传一张图片'
                    });
                }
                return check;
            },

        //    提交添加轮播
            commit_add_lunbo(){

            }

        }
    }
</script>

<style scoped>

</style>
