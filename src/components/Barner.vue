<template>
    <div>
        <Row style="margin: -24px -24px 30px -24px;background-color: #fff;
                padding: 15px 20px; border-bottom: 1px solid #dcdee2;color: #fff;
                border-left: 8px solid #19be6b;
                ">
            <Col span="24">
                <Breadcrumb style="font-size: 14px;" separator="<b class='demo-breadcrumb-separator'>=></b>">
                    <!--<BreadcrumbItem to="/">您的位置</BreadcrumbItem>-->
                    <BreadcrumbItem to="/">您的位置</BreadcrumbItem>
                    <BreadcrumbItem :style="{color: '#57a3f3'}">{{$store.state.meau_name}}</BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "barner",
        data(){
            return{
                meaus_name:'主页面'
            }
        },
        created(){
            // this.get_meau_name();
        },
        methods:{
            // get_meau_name(){
            //     this.meaus_name = this.$store.state.meau_name
            // }
        }
    }
</script>

<style scoped>
    /deep/ .demo-breadcrumb-separator {
        /*color: #ff5500;*/
        color: #ff9900;
        padding: 0 5px;
    }
</style>
