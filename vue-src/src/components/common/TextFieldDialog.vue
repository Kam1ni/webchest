<template>
	<v-dialog v-model="value" persistentn max-width="500px">
		<v-card>
			<v-card-title>
				<span class="headline">{{title}}</span>
			</v-card-title>
			<v-card-text>
				 <v-container grid-list-md>
					 <v-layout wrap>
						 <v-flex xs12>
							 <v-text-field v-model="textValue" :label="label" required></v-text-field>
						 </v-flex>
					 </v-layout>
				 </v-container>
			</v-card-text>
			<v-card-actions>
				<v-btn flat @click="submit()">Submit</v-btn>
				<v-btn flat @click="cancel()">Cancel</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		data(){
			return {
				textValue: ""
			}
		},
		methods:{
			submit(){
				this.$emit("input", false);
				this.$emit("submit", this.textValue);
			},
			cancel(){
				this.$emit("input", false);
			}
		},
		props:['value', 'title', 'label']
	}
</script>
