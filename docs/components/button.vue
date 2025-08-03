<template>
	<button class="btn">Button</button>
</template>
<script setup lang="ts"></script>
<style scope lang="scss">
	.btn {
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
