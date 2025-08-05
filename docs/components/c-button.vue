<template>
	<button class="btn">C-Button</button>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
	.btn {
		outline: none;
		border: 1px solid #ff2b2b;
		background-color: #ededed;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: #9f5c5c;
		}
	}
</style>
