<template>
	<button class="xbtn" @click="click">JS XButton</button>
</template>
<script setup lang="js">
	const click = () => console.log("js");
</script>
<style scoped lang="scss">
	.xbtn {
		outline: none;
		border: 1px solid #ccc;
		background-color: #fff;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: #f5f5f5;
		}
	}
</style>
