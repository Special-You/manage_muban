<template>
    <div>
        <Row :style="{marginTop:'-20px', marginBottom:'10px'}">
            <Col :sm="22" :md="22" :lg="22">
                .
            </Col>
            <Col :sm="2" :md="2" :lg="2">
                <Button type="dashed" shape="circle" ref="Add">添加</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "Add"
    }
</script>

<style scoped>

</style>
