<template>
	<v-container>
		<v-layout row wrap>
			<v-flex xs12>
				<v-card>
					<v-card-title primary-title>Username: {{$AuthService.user.username}}</v-card-title>
					<v-spacer></v-spacer>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		
	}
</script>
