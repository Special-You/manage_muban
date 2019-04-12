<template>
    <div>
        <Row style="margin: -24px -24px 30px -24px;background-color: #fff;
                padding: 15px 20px; border-bottom: 1px solid #dcdee2;color: #fff;
                border-left: 8px solid #19be6b;
                ">
            <Col span="24">
                <Breadcrumb style="font-size: 14px;" separator=">">
                    <BreadcrumbItem to="/">您的位置</BreadcrumbItem>
                    <BreadcrumbItem>商品管理</BreadcrumbItem>
                    <BreadcrumbItem :style="{color: '#57a3f3'}">商品管理</BreadcrumbItem>
                </Breadcrumb>
            </Col>
        </Row>

    </div>
</template>

<script>
    export default {
        name: "GoodsMan"
    }
</script>

<style scoped>

</style>
