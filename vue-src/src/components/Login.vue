<template>
	<v-card class="elevation-24">
		<v-form v-model="valid">
			<v-card-title primary-title>
				<div class="headline">
					Login
				</div>
			</v-card-title>
			<v-card-text>
				<v-text-field label="Username" v-model="username" required></v-text-field>
				<v-text-field label="password" v-model="password" required type="password"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-btn flat>Login</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
	export default{
		data(){
			return {
				valid:false,
				username: "",
				password: ""
			}
		}
	}
</script>